#include "machine_id.h"
#include <windows.h>

std::string GetMachineId()
{
	HKEY hKey;
	if (RegOpenKeyExA(HKEY_LOCAL_MACHINE, "SOFTWARE\\Microsoft\\Cryptography", 0, KEY_READ, &hKey) != ERROR_SUCCESS)
		return "";

	char value[256];
	DWORD len = sizeof(value);
	if (RegGetValueA(hKey, nullptr, "MachineGuid", RRF_RT_REG_SZ, nullptr, &value, &len) != ERROR_SUCCESS)
	{
		RegCloseKey(hKey);
		return "";
	}

	RegCloseKey(hKey);
	return std::string(value);
}
