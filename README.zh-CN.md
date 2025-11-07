# @holix/machine-id-native

[![npm version](https://img.shields.io/npm/v/@holix/machine-id-native.svg)](https://www.npmjs.com/package/@holix/machine-id-native)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@holix/machine-id-native.svg)](https://nodejs.org)

一个用于跨平台（Windows、macOS、Linux）获取唯一机器标识符和硬件指纹的原生 Node.js 插件。

[English](./README.md) | 简体中文

## ✨ 特性

- 🚀 **高性能**: 原生 C++ 实现，性能最优
- 🔒 **稳定标识**: 应用重启后返回一致的机器 ID
- 🌍 **跨平台**: 支持 Windows、macOS 和 Linux
- 📦 **零依赖**: 生产环境无运行时依赖
- 💪 **TypeScript 支持**: 完整的 TypeScript 类型定义
- 🔧 **原生插件**: 使用 N-API，在不同 Node.js 版本间保持稳定
- 🎯 **多种方法**: 提供多种硬件指纹获取方法

## 🖥️ 平台支持

| 平台 | 主要方法 | 数据源 | 附加方法 |
|------|---------|--------|---------|
| **Windows** | MachineGuid | Windows 注册表 | BIOS UUID、主板序列号 |
| **macOS** | IOPlatformUUID | IOKit 框架 | IOPlatform 序列号 |
| **Linux** | machine-id | `/etc/machine-id` | 产品 UUID、主板序列号 |

## 📦 安装

```bash
npm install @holix/machine-id-native
# 或
yarn add @holix/machine-id-native
# 或
pnpm add @holix/machine-id-native
```

### 构建要求

从源码构建需要：

- Node.js >= 16.0.0
- Python 3（用于 node-gyp）
- C++ 编译器：
  - **Windows**: Visual Studio Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: GCC/G++

## 📖 使用方法

### CommonJS

```javascript
const getMachineId = require('@holix/machine-id-native');

const machineId = getMachineId();
console.log(machineId);
// 输出: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### ES Modules

```javascript
import {getMachineId} from '@holix/machine-id-native';

const machineId = getMachineId();
console.log(machineId);
// 输出: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

### TypeScript

```typescript
import {getMachineId} from '@holix/machine-id-native';

const machineId: string = getMachineId();
console.log(machineId);
```

### 高级用法 - 平台特定方法

```typescript
import { 
  getAllFingerprints,
  getMachineGuid,      // 仅 Windows
  getBiosUUID,         // 仅 Windows
  getBaseBoardSerial,  // 仅 Windows
  getIOPlatformUUID,   // 仅 macOS
  getIOPlatformSerialNumber, // 仅 macOS
  getMachineIdLinux,   // 仅 Linux
  getProductUUID,      // 仅 Linux
  getBoardSerial       // 仅 Linux
} from '@holix/machine-id-native';

// 获取当前平台所有可用的指纹信息
const fingerprints = getAllFingerprints();
console.log(fingerprints);
// Windows: { machineId: "...", machineGuid: "...", biosUUID: "...", baseBoardSerial: "..." }
// macOS: { machineId: "...", ioPlatformUUID: "...", ioPlatformSerialNumber: "..." }
// Linux: { machineId: "...", machineIdLinux: "...", productUUID: "...", boardSerial: "..." }

// 使用平台特定方法（如果不在正确的平台上会抛出错误）
if (process.platform === 'win32') {
  console.log('机器 GUID:', getMachineGuid());
  console.log('BIOS UUID:', getBiosUUID());
  console.log('主板序列号:', getBaseBoardSerial());
} else if (process.platform === 'darwin') {
  console.log('IOPlatform UUID:', getIOPlatformUUID());
  console.log('IOPlatform 序列号:', getIOPlatformSerialNumber());
} else if (process.platform === 'linux') {
  console.log('机器 ID:', getMachineIdLinux());
  console.log('产品 UUID:', getProductUUID());
  console.log('主板序列号:', getBoardSerial());
}
```

## ⚡ Electron 支持

此包可与 Electron 应用程序配合使用。安装后，您需要为 Electron 重新构建原生模块：

### 使用 electron-rebuild（推荐）

```bash
# 安装 electron-rebuild 作为开发依赖
npm install --save-dev electron-rebuild

# 为 Electron 重新构建原生模块
npx electron-rebuild
```

### 使用 @electron/rebuild

```bash
# 安装 @electron/rebuild
npm install --save-dev @electron/rebuild

# 重新构建
npx electron-rebuild
```

### 使用 electron-gyp 手动重新构建

```bash
# 安装 electron-gyp
npm install -g electron-gyp

# 设置 electron 版本并重新构建
electron-gyp rebuild --target=<electron-version> --arch=<your-arch> --dist-url=https://electronjs.org/headers
```

### 添加到 package.json 脚本

在您的 Electron 项目的 `package.json` 中添加：

```json
{
  "scripts": {
    "rebuild": "electron-rebuild -f -w @holix/machine-id-native",
    "postinstall": "electron-rebuild"
  }
}
```

### 在 Electron 主进程中使用

```typescript
// main.ts 或 main.js
import { app } from 'electron';
import {getMachineId} from '@holix/machine-id-native';

app.whenReady().then(() => {
  const machineId = getMachineId();
  console.log('机器 ID:', machineId);
});
```

## 📚 API

### 核心函数

#### `getMachineId(): string`

获取当前机器的唯一标识符。

**返回值：** 表示唯一机器标识符的字符串。

**异常：** 如果无法从系统获取机器 ID，则抛出错误。

#### `getAllFingerprints(): Record<string, string>`

获取当前平台所有可用的指纹信息。

**返回值：** 包含所有可用指纹数据的对象。键取决于平台：
- **Windows**: `machineId`, `machineGuid`, `biosUUID`, `baseBoardSerial`
- **macOS**: `machineId`, `ioPlatformUUID`, `ioPlatformSerialNumber`
- **Linux**: `machineId`, `machineIdLinux`, `productUUID`, `boardSerial`

### Windows 特定函数

#### `getMachineGuid(): string`

从 Windows 注册表获取机器 GUID。

**平台：** 仅 Windows

**返回值：** 机器 GUID 字符串

**异常：** 如果不在 Windows 平台上则抛出错误

#### `getBiosUUID(): string`

通过 WMI 获取 BIOS UUID。

**平台：** 仅 Windows

**返回值：** BIOS UUID 字符串

**异常：** 如果不在 Windows 平台上则抛出错误

#### `getBaseBoardSerial(): string`

通过 WMI 获取主板序列号。

**平台：** 仅 Windows

**返回值：** 主板序列号

**异常：** 如果不在 Windows 平台上则抛出错误

### macOS 特定函数

#### `getIOPlatformUUID(): string`

从 IOKit 获取 IOPlatform UUID。

**平台：** 仅 macOS

**返回值：** IOPlatform UUID 字符串

**异常：** 如果不在 macOS 平台上则抛出错误

#### `getIOPlatformSerialNumber(): string`

从 IOKit 获取 IOPlatform 序列号。

**平台：** 仅 macOS

**返回值：** IOPlatform 序列号

**异常：** 如果不在 macOS 平台上则抛出错误

### Linux 特定函数

#### `getMachineIdLinux(): string`

从 `/etc/machine-id` 或 `/var/lib/dbus/machine-id` 获取机器 ID。

**平台：** 仅 Linux

**返回值：** 机器 ID 字符串

**异常：** 如果不在 Linux 平台上则抛出错误

#### `getProductUUID(): string`

从 `/sys/class/dmi/id/product_uuid` 获取产品 UUID。

**平台：** 仅 Linux

**返回值：** 产品 UUID 字符串

**异常：** 如果不在 Linux 平台上则抛出错误

#### `getBoardSerial(): string`

从 `/sys/class/dmi/id/board_serial` 获取主板序列号。

**平台：** 仅 Linux

**返回值：** 主板序列号

**异常：** 如果不在 Linux 平台上则抛出错误

## 🔧 开发

### 前置条件

```bash
# 如果尚未安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install
```

### 构建

```bash
# 完整构建（native + TypeScript）
pnpm run build

# 仅构建 native 插件
pnpm run build:node

# 仅构建 TypeScript
pnpm run build:ts
```

### 测试

```bash
# 运行所有测试
pnpm test

# 仅运行 CommonJS 测试
pnpm run test:cjs

# 仅运行 ESM 测试
pnpm run test:esm

# 运行性能基准测试
pnpm run benchmark
```

### 测试覆盖

项目包含全面的测试：
- ✅ 返回类型验证
- ✅ 一致性检查（多次调用返回相同 ID）
- ✅ 非空/未定义验证
- ✅ 格式验证
- ✅ CommonJS 和 ESM 兼容性
- ✅ 跨平台支持（Windows、macOS、Linux）

### 项目结构

```
machine-id-native/
├── src/
│   ├── addon.cpp                    # N-API 绑定
│   ├── machine_id.h                 # 头文件
│   ├── machine_id_win.cpp           # Windows 实现
│   ├── machine_id_mac.cpp           # macOS 实现
│   ├── machine_id_linux.cpp         # Linux 实现
│   ├── machine_fingerprint.h        # 指纹头文件
│   ├── machine_fingerprint_native.cpp # 指纹实现
│   └── index.ts                     # TypeScript 入口点
├── test/
│   ├── index.test.cjs               # CommonJS 测试
│   ├── index.test.mjs               # ESM 测试
│   ├── fingerprint.test.mjs         # 指纹功能测试
│   └── benchmark.mjs                # 性能基准测试
├── binding.gyp                      # Node-gyp 配置
├── tsconfig.json                    # TypeScript 配置
├── tsdown.config.ts                 # 构建配置
└── package.json
```

## 📄 许可证

MIT

## 👤 作者

**zhaozunhong**

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 🐛 故障排查

### 构建错误

如果遇到构建错误，请确保已安装正确的构建工具：

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

### Electron 构建问题

如果在为 Electron 构建时遇到问题：

1. **清除构建缓存：**
   ```bash
   rm -rf build node_modules
   npm install
   npx electron-rebuild
   ```

2. **显式指定 Electron 版本：**
   ```bash
   npx electron-rebuild -v 28.0.0
   ```

3. **检查 Node ABI 兼容性：**
   - Electron 使用的 ABI 与 Node.js 不同
   - 更新 Electron 后始终重新构建
   - 使用 `electron-rebuild` 或 `@electron/rebuild`

4. **ARM64（Apple Silicon）问题：**
   ```bash
   # 强制为 arm64 构建
   npm install --target_arch=arm64
   npx electron-rebuild -a arm64
   ```

### 缺少机器 ID

如果函数抛出错误，请确保系统已配置有效的机器 ID：

- **Linux**: 检查 `/etc/machine-id` 或 `/var/lib/dbus/machine-id`
- **Windows**: 验证注册表项：`HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography\\MachineGuid`
- **macOS**: IOKit 框架应该自动提供

## 🔗 相关项目

- [node-machine-id](https://github.com/automation-stack/node-machine-id) - 纯 JavaScript 实现
- [node-addon-api](https://github.com/nodejs/node-addon-api) - N-API C++ 包装器
- [electron-rebuild](https://github.com/electron/rebuild) - 为 Electron 重新构建原生模块

## 📝 更新日志

### 0.0.1 (Beta)

- 初始版本
- 支持 Windows、macOS 和 Linux
- TypeScript 支持
- ESM 和 CommonJS 导出
- Electron 兼容性
- 多种硬件指纹获取方法
