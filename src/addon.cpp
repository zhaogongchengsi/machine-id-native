#include <napi.h>
#include "machine_id.h"

Napi::String GetMachineIdWrapped(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	std::string id = GetMachineId();
	return Napi::String::New(env, id);
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
	exports.Set("getMachineId", Napi::Function::New(env, GetMachineIdWrapped));
	return exports;
}

NODE_API_MODULE(machine_id_native, Init)
