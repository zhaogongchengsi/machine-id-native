# @holix/machine-id-native

[![npm version](https://img.shields.io/npm/v/@holix/machine-id-native.svg)](https://www.npmjs.com/package/@holix/machine-id-native)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A native Node.js addon to retrieve unique machine identifiers across different platforms (Windows, macOS, Linux).

## Features

- 🚀 **High Performance**: Native C++ implementation for maximum speed
- 🔒 **Stable Identifiers**: Returns consistent machine IDs across application restarts
- 🌍 **Cross-Platform**: Works on Windows, macOS, and Linux
- 📦 **Zero Dependencies**: No runtime dependencies (production)
- 💪 **TypeScript Support**: Full TypeScript type definitions included
- 🔧 **Native Addon**: Uses N-API for stability across Node.js versions

## Platform Support

| Platform | Method | Source |
|----------|--------|--------|
| **Windows** | MachineGuid | Windows Registry |
| **macOS** | IOPlatformUUID | IOKit Framework |
| **Linux** | machine-id | `/etc/machine-id` or `/var/lib/dbus/machine-id` |

## Installation

```bash
npm install @holix/machine-id-native
# or
yarn add @holix/machine-id-native
# or
pnpm add @holix/machine-id-native
```

### Build Requirements

To build from source, you need:

- Node.js >= 16.0.0
- Python 3 (for node-gyp)
- C++ compiler:
  - **Windows**: Visual Studio Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: GCC/G++

## Usage

### CommonJS

```javascript
const getMachineId = require('@holix/machine-id-native');

const machineId = getMachineId();
console.log(machineId);
// Output: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### ES Modules

```javascript
import getMachineId from '@holix/machine-id-native';

const machineId = getMachineId();
console.log(machineId);
// Output: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### TypeScript

```typescript
import getMachineId from '@holix/machine-id-native';

const machineId: string = getMachineId();
console.log(machineId);
```

## API

### `getMachineId(): string`

Retrieves a unique identifier for the current machine.

**Returns:** A string representing the unique machine identifier.

**Throws:** An error if the machine ID cannot be retrieved from the system.

## Development

### Prerequisites

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install
```

### Building

```bash
# Build both native addon and TypeScript
pnpm run build

# Build only native addon
pnpm run build:node

# Build only TypeScript
pnpm run build:ts
```

### Project Structure

```
machine-id-native/
├── src/
│   ├── addon.cpp           # N-API bindings
│   ├── machine_id.h        # Header file
│   ├── machine_id_win.cpp  # Windows implementation
│   ├── machine_id_mac.cpp  # macOS implementation
│   ├── machine_id_linux.cpp# Linux implementation
│   └── index.ts            # TypeScript entry point
├── binding.gyp             # Node-gyp configuration
├── tsconfig.json           # TypeScript configuration
├── tsdown.config.ts        # Build configuration
└── package.json
```

## License

ISC

## Author

**zhaozunhong**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Troubleshooting

### Build Errors

If you encounter build errors, ensure you have the proper build tools installed:

**Windows:**
```bash
npm install --global windows-build-tools
```

**macOS:**
```bash
xcode-select --install
```

**Linux:**
```bash
sudo apt-get install build-essential
```

### Missing Machine ID

If the function throws an error, ensure your system has a valid machine ID configured:

- **Linux**: Check `/etc/machine-id` or `/var/lib/dbus/machine-id`
- **Windows**: Verify registry key at `HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography\\MachineGuid`
- **macOS**: The IOKit framework should provide this automatically

## Related Projects

- [node-machine-id](https://github.com/automation-stack/node-machine-id) - Pure JavaScript implementation
- [node-addon-api](https://github.com/nodejs/node-addon-api) - N-API C++ wrapper

## Changelog

### 1.0.0

- Initial release
- Support for Windows, macOS, and Linux
- TypeScript support
- ESM and CommonJS exports
