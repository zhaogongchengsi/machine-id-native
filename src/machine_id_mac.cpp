#include "machine_id.h"
#include <TargetConditionals.h>
#include <CoreFoundation/CoreFoundation.h>
#include <IOKit/IOKitLib.h>

std::string GetMachineId()
{
#if __MAC_OS_X_VERSION_MIN_REQUIRED < 120000
	io_service_t platformExpert = IOServiceGetMatchingService(
		kIOMasterPortDefault,
		IOServiceMatching("IOPlatformExpertDevice"));
#else
	io_service_t platformExpert = IOServiceGetMatchingService(
		kIOMainPortDefault,
		IOServiceMatching("IOPlatformExpertDevice"));
#endif

	if (!platformExpert)
		return "";

	CFTypeRef uuidRef = IORegistryEntryCreateCFProperty(
		platformExpert,
		CFSTR("IOPlatformUUID"),
		kCFAllocatorDefault,
		0);
	IOObjectRelease(platformExpert);

	if (!uuidRef)
		return "";

	char buffer[256];
	CFStringGetCString((CFStringRef)uuidRef, buffer, sizeof(buffer), kCFStringEncodingUTF8);
	CFRelease(uuidRef);
	return std::string(buffer);
}
