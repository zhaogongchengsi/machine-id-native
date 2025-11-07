#include <napi.h>
#include "machine_id.h"
#include "machine_fingerprint.h"

Napi::String GetMachineIdWrapped(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string id = GetMachineId();
	return Napi::String::New(env, id);
}

#ifdef _WIN32
// Windows-specific fingerprint functions
Napi::String GetMachineGuidWrapped(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string guid = getMachineGuid();
	return Napi::String::New(env, guid);
}

Napi::String GetBiosUUIDWrapped(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string uuid = getBiosUUID();
	return Napi::String::New(env, uuid);
}

Napi::String GetBaseBoardSerialWrapped(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string serial = getBaseBoardSerial();
	return Napi::String::New(env, serial);
}

#elif defined(__APPLE__)
// macOS-specific fingerprint functions
Napi::String GetIOPlatformUUIDWrapped(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string uuid = getIOPlatformUUID();
	return Napi::String::New(env, uuid);
}

Napi::String GetIOPlatformSerialNumberWrapped(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string serial = getIOPlatformSerialNumber();
	return Napi::String::New(env, serial);
}

#else
// Linux-specific fingerprint functions
Napi::String GetMachineIdLinuxWrapped(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string id = getMachineId();
	return Napi::String::New(env, id);
}

Napi::String GetProductUUIDWrapped(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string uuid = getProductUUID();
	return Napi::String::New(env, uuid);
}

Napi::String GetBoardSerialWrapped(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string serial = getBoardSerial();
	return Napi::String::New(env, serial);
}
#endif

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
	// Main function
	exports.Set("getMachineId", Napi::Function::New(env, GetMachineIdWrapped));

#ifdef _WIN32
	// Windows fingerprint methods
	exports.Set("getMachineGuid", Napi::Function::New(env, GetMachineGuidWrapped));
	exports.Set("getBiosUUID", Napi::Function::New(env, GetBiosUUIDWrapped));
	exports.Set("getBaseBoardSerial", Napi::Function::New(env, GetBaseBoardSerialWrapped));
#elif defined(__APPLE__)
	// macOS fingerprint methods
	exports.Set("getIOPlatformUUID", Napi::Function::New(env, GetIOPlatformUUIDWrapped));
	exports.Set("getIOPlatformSerialNumber", Napi::Function::New(env, GetIOPlatformSerialNumberWrapped));
#else
	// Linux fingerprint methods
	exports.Set("getMachineIdLinux", Napi::Function::New(env, GetMachineIdLinuxWrapped));
	exports.Set("getProductUUID", Napi::Function::New(env, GetProductUUIDWrapped));
	exports.Set("getBoardSerial", Napi::Function::New(env, GetBoardSerialWrapped));
#endif

	return exports;
}

NODE_API_MODULE(machine_id_native, Init)
