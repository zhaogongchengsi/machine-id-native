#include "machine_id.h"
#include <fstream>

std::string GetMachineId()
{
	const char *paths[] = {"/etc/machine-id", "/var/lib/dbus/machine-id"};
	for (auto path : paths)
	{
		std::ifstream file(path);
		if (file)
		{
			std::string id;
			std::getline(file, id);
			return id;
		}
	}
	return "";
}
