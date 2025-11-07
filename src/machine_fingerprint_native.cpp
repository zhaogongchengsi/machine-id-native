#include <string>
#include <algorithm>
#include <fstream>
#include <sstream>

#ifdef _WIN32
#define NOMINMAX
#include <windows.h>
#include <comdef.h>
#include <wbemidl.h>
#pragma comment(lib, "wbemuuid.lib")
#elif defined(__APPLE__)
#include <CoreFoundation/CoreFoundation.h>
#include <IOKit/IOKitLib.h>
#include <TargetConditionals.h>
#else
#include <stdio.h>
#include <stdlib.h>
#endif

// ====== 通用工具 ======
static std::string trim(std::string s)
{
	s.erase(std::remove_if(s.begin(), s.end(), [](unsigned char c)
						   { return c == '\r' || c == '\n' || c == ' ' || c == '\t'; }),
			s.end());
	return s;
}

#ifdef _WIN32
// ====== Windows ======
std::string getMachineGuid()
{
	HKEY hKey;
	if (RegOpenKeyExA(HKEY_LOCAL_MACHINE,
					  "SOFTWARE\\Microsoft\\Cryptography", 0, KEY_READ, &hKey) != ERROR_SUCCESS)
		return "";
	char buf[256] = {0};
	DWORD len = sizeof(buf);
	LONG rc = RegGetValueA(hKey, nullptr, "MachineGuid",
						   RRF_RT_REG_SZ, nullptr, buf, &len);
	RegCloseKey(hKey);
	if (rc != ERROR_SUCCESS)
		return "";
	return trim(buf);
}

static std::string queryWMI(const wchar_t *wql, const wchar_t *field)
{
	std::string result;
	HRESULT hr;
	hr = CoInitializeEx(0, COINIT_MULTITHREADED);
	if (FAILED(hr))
		return "";

	IWbemLocator *pLoc = nullptr;
	IWbemServices *pSvc = nullptr;

	if (FAILED(CoCreateInstance(CLSID_WbemLocator, 0, CLSCTX_INPROC_SERVER,
								IID_IWbemLocator, (LPVOID *)&pLoc)))
	{
		CoUninitialize();
		return "";
	}

	if (FAILED(pLoc->ConnectServer(_bstr_t(L"ROOT\\CIMV2"), nullptr, nullptr, 0, NULL, 0, 0, &pSvc)))
	{
		pLoc->Release();
		CoUninitialize();
		return "";
	}

	CoSetProxyBlanket(pSvc, RPC_C_AUTHN_WINNT, RPC_C_AUTHZ_NONE, NULL,
					  RPC_C_AUTHN_LEVEL_CALL, RPC_C_IMP_LEVEL_IMPERSONATE, NULL, EOAC_NONE);

	IEnumWbemClassObject *pEnumerator = nullptr;
	if (FAILED(pSvc->ExecQuery(bstr_t("WQL"), bstr_t(wql),
							   WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY, NULL, &pEnumerator)))
	{
		pSvc->Release();
		pLoc->Release();
		CoUninitialize();
		return "";
	}

	IWbemClassObject *pclsObj = nullptr;
	ULONG uReturn = 0;
	if (pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn) == S_OK)
	{
		VARIANT vtProp;
		VariantInit(&vtProp);
		if (SUCCEEDED(pclsObj->Get(field, 0, &vtProp, 0, 0)) && vtProp.vt == VT_BSTR)
		{
			_bstr_t b = vtProp.bstrVal;
			result = (const char *)b;
		}
		VariantClear(&vtProp);
		pclsObj->Release();
	}

	if (pEnumerator)
		pEnumerator->Release();
	pSvc->Release();
	pLoc->Release();
	CoUninitialize();
	return trim(result);
}

std::string getBiosUUID()
{
	return queryWMI(L"SELECT UUID FROM Win32_ComputerSystemProduct", L"UUID");
}

std::string getBaseBoardSerial()
{
	return queryWMI(L"SELECT SerialNumber FROM Win32_BaseBoard", L"SerialNumber");
}

#elif defined(__APPLE__)
// ====== macOS ======
static std::string readIOReg(CFStringRef key)
{
#if __MAC_OS_X_VERSION_MIN_REQUIRED < 120000
	io_service_t platformExpert = IOServiceGetMatchingService(kIOMasterPortDefault, IOServiceMatching("IOPlatformExpertDevice"));
#else
	io_service_t platformExpert = IOServiceGetMatchingService(kIOMainPortDefault, IOServiceMatching("IOPlatformExpertDevice"));
#endif
	if (!platformExpert)
		return "";
	CFTypeRef val = IORegistryEntryCreateCFProperty(platformExpert, key, kCFAllocatorDefault, 0);
	IOObjectRelease(platformExpert);
	if (!val)
		return "";

	char buf[256];
	bool ok = CFGetTypeID(val) == CFStringGetTypeID() &&
			  CFStringGetCString((CFStringRef)val, buf, sizeof(buf), kCFStringEncodingUTF8);
	CFRelease(val);
	return ok ? trim(buf) : "";
}

std::string getIOPlatformUUID()
{
	return readIOReg(CFSTR("IOPlatformUUID"));
}

std::string getIOPlatformSerialNumber()
{
	return readIOReg(CFSTR("IOPlatformSerialNumber"));
}

#else
// ====== Linux ======
static std::string readFile(const char *path)
{
	std::ifstream f(path);
	if (!f.is_open())
		return "";
	std::stringstream ss;
	ss << f.rdbuf();
	return trim(ss.str());
}

std::string getMachineId()
{
	std::string id = readFile("/etc/machine-id");
	if (id.empty())
		id = readFile("/var/lib/dbus/machine-id");
	return id;
}

std::string getProductUUID()
{
	return readFile("/sys/class/dmi/id/product_uuid");
}

std::string getBoardSerial()
{
	return readFile("/sys/class/dmi/id/board_serial");
}
#endif
