#pragma once
#include <string>

// Platform-specific functions

#ifdef _WIN32
// Windows
std::string getMachineGuid();
std::string getBiosUUID();
std::string getBaseBoardSerial();

#elif defined(__APPLE__)
// macOS
std::string getIOPlatformUUID();
std::string getIOPlatformSerialNumber();

#else
// Linux
std::string getMachineId();
std::string getProductUUID();
std::string getBoardSerial();
#endif
