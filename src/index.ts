import { createRequire } from 'module';
import { join } from 'path'

const _require = createRequire(import.meta.url);
// 这里直接引入 C++ 编译生成的 .node 文件
const native = _require(join(__dirname, "../build/Release/machine_id_native.node"));

/**
 * Retrieves a unique identifier for the current machine.
 * 
 * This function generates or retrieves a stable machine identifier that remains
 * consistent across application restarts. The identifier is platform-specific
 * and is obtained through native system APIs.
 * 
 * @returns A string representing the unique machine identifier.
 * 
 * @example
 * ```typescript
 * const machineId = getMachineId();
 * console.log(machineId); // e.g., "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 * ```
 */
export default function getMachineId(): string {
	return native.getMachineId();
}