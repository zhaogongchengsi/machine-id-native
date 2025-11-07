# @holix/machine-id-native

[![npm version](https://img.shields.io/npm/v/@holix/machine-id-native.svg)](https://www.npmjs.com/package/@holix/machine-id-native)
[![CI/CD](https://github.com/zhaogongchengsi/machine-id-native/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/zhaogongchengsi/machine-id-native/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@holix/machine-id-native.svg)](https://nodejs.org)

A native Node.js addon to retrieve unique machine identifiers and hardware fingerprints across different platforms (Windows, macOS, Linux).

English | [简体中文](./README.zh-CN.md)

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

### Advanced Usage - Platform-Specific Methods

```typescript
import { 
  getAllFingerprints,
  getMachineGuid,      // Windows only
  getBiosUUID,         // Windows only
  getBaseBoardSerial,  // Windows only
  getIOPlatformUUID,   // macOS only
  getIOPlatformSerialNumber, // macOS only
  getMachineIdLinux,   // Linux only
  getProductUUID,      // Linux only
  getBoardSerial       // Linux only
} from '@holix/machine-id-native';

// Get all available fingerprints for the current platform
const fingerprints = getAllFingerprints();
console.log(fingerprints);
// Windows: { machineId: "...", machineGuid: "...", biosUUID: "...", baseBoardSerial: "..." }
// macOS: { machineId: "...", ioPlatformUUID: "...", ioPlatformSerialNumber: "..." }
// Linux: { machineId: "...", machineIdLinux: "...", productUUID: "...", boardSerial: "..." }

// Use platform-specific methods (will throw error if not on correct platform)
if (process.platform === 'win32') {
  console.log('Machine GUID:', getMachineGuid());
  console.log('BIOS UUID:', getBiosUUID());
  console.log('Baseboard Serial:', getBaseBoardSerial());
} else if (process.platform === 'darwin') {
  console.log('IOPlatform UUID:', getIOPlatformUUID());
  console.log('IOPlatform Serial:', getIOPlatformSerialNumber());
} else if (process.platform === 'linux') {
  console.log('Machine ID:', getMachineIdLinux());
  console.log('Product UUID:', getProductUUID());
  console.log('Board Serial:', getBoardSerial());
}
```

## Electron Support

This package works with Electron applications. After installing, you need to rebuild the native module for Electron:

### Using electron-rebuild (Recommended)

```bash
# Install electron-rebuild as a dev dependency
npm install --save-dev electron-rebuild

# Rebuild native modules for Electron
npx electron-rebuild
```

### Using @electron/rebuild

```bash
# Install @electron/rebuild
npm install --save-dev @electron/rebuild

# Rebuild
npx electron-rebuild
```

### Manual rebuild with electron-gyp

```bash
# Install electron-gyp
npm install -g electron-gyp

# Set electron version and rebuild
electron-gyp rebuild --target=<electron-version> --arch=<your-arch> --dist-url=https://electronjs.org/headers
```

### Add to package.json scripts

Add this to your Electron project's `package.json`:

```json
{
  "scripts": {
    "rebuild": "electron-rebuild -f -w @holix/machine-id-native",
    "postinstall": "electron-rebuild"
  }
}
```

### Usage in Electron Main Process

```typescript
// main.ts or main.js
import { app } from 'electron';
import getMachineId from '@holix/machine-id-native';

app.whenReady().then(() => {
  const machineId = getMachineId();
  console.log('Machine ID:', machineId);
});
```

## API

### Core Functions

#### `getMachineId(): string`

Retrieves a unique identifier for the current machine.

**Returns:** A string representing the unique machine identifier.

**Throws:** An error if the machine ID cannot be retrieved from the system.

#### `getAllFingerprints(): Record<string, string>`

Gets all available fingerprint information for the current platform.

**Returns:** An object containing all available fingerprint data. The keys depend on the platform:
- **Windows**: `machineId`, `machineGuid`, `biosUUID`, `baseBoardSerial`
- **macOS**: `machineId`, `ioPlatformUUID`, `ioPlatformSerialNumber`
- **Linux**: `machineId`, `machineIdLinux`, `productUUID`, `boardSerial`

### Windows-Specific Functions

#### `getMachineGuid(): string`

Get Machine GUID from Windows Registry.

**Platform:** Windows only

**Returns:** Machine GUID string

**Throws:** Error if not on Windows platform

#### `getBiosUUID(): string`

Get BIOS UUID via WMI.

**Platform:** Windows only

**Returns:** BIOS UUID string

**Throws:** Error if not on Windows platform

#### `getBaseBoardSerial(): string`

Get Base Board Serial Number via WMI.

**Platform:** Windows only

**Returns:** Base board serial number

**Throws:** Error if not on Windows platform

### macOS-Specific Functions

#### `getIOPlatformUUID(): string`

Get IOPlatform UUID from IOKit.

**Platform:** macOS only

**Returns:** IOPlatform UUID string

**Throws:** Error if not on macOS platform

#### `getIOPlatformSerialNumber(): string`

Get IOPlatform Serial Number from IOKit.

**Platform:** macOS only

**Returns:** IOPlatform serial number

**Throws:** Error if not on macOS platform

### Linux-Specific Functions

#### `getMachineIdLinux(): string`

Get machine ID from `/etc/machine-id` or `/var/lib/dbus/machine-id`.

**Platform:** Linux only

**Returns:** Machine ID string

**Throws:** Error if not on Linux platform

#### `getProductUUID(): string`

Get product UUID from `/sys/class/dmi/id/product_uuid`.

**Platform:** Linux only

**Returns:** Product UUID string

**Throws:** Error if not on Linux platform

#### `getBoardSerial(): string`

Get board serial number from `/sys/class/dmi/id/board_serial`.

**Platform:** Linux only

**Returns:** Board serial number

**Throws:** Error if not on Linux platform

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

### Electron Build Issues

If you encounter issues building for Electron:

1. **Clear the build cache:**
   ```bash
   rm -rf build node_modules
   npm install
   npx electron-rebuild
   ```

2. **Specify Electron version explicitly:**
   ```bash
   npx electron-rebuild -v 28.0.0
   ```

3. **Check Node ABI compatibility:**
   - Electron uses a different ABI than Node.js
   - Always rebuild after updating Electron
   - Use `electron-rebuild` or `@electron/rebuild`

4. **ARM64 (Apple Silicon) issues:**
   ```bash
   # Force build for arm64
   npm install --target_arch=arm64
   npx electron-rebuild -a arm64
   ```

### Missing Machine ID

If the function throws an error, ensure your system has a valid machine ID configured:

- **Linux**: Check `/etc/machine-id` or `/var/lib/dbus/machine-id`
- **Windows**: Verify registry key at `HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography\\MachineGuid`
- **macOS**: The IOKit framework should provide this automatically

## Related Projects

- [node-machine-id](https://github.com/automation-stack/node-machine-id) - Pure JavaScript implementation
- [node-addon-api](https://github.com/nodejs/node-addon-api) - N-API C++ wrapper
- [electron-rebuild](https://github.com/electron/rebuild) - Rebuild native modules for Electron

## Changelog

### 0.0.1 (Beta)

- Initial release
- Support for Windows, macOS, and Linux
- TypeScript support
- ESM and CommonJS exports
- Electron compatibility

