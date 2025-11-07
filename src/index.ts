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

// Platform-specific fingerprint methods

/**
 * Windows: Get Machine GUID from registry
 * @returns Machine GUID string
 * @platform Windows
 */
export function getMachineGuid(): string {
	if (typeof native.getMachineGuid === 'function') {
		return native.getMachineGuid();
	}
	throw new Error('getMachineGuid is only available on Windows');
}

/**
 * Windows: Get BIOS UUID
 * @returns BIOS UUID string
 * @platform Windows
 */
export function getBiosUUID(): string {
	if (typeof native.getBiosUUID === 'function') {
		return native.getBiosUUID();
	}
	throw new Error('getBiosUUID is only available on Windows');
}

/**
 * Windows: Get Base Board Serial Number
 * @returns Base board serial number
 * @platform Windows
 */
export function getBaseBoardSerial(): string {
	if (typeof native.getBaseBoardSerial === 'function') {
		return native.getBaseBoardSerial();
	}
	throw new Error('getBaseBoardSerial is only available on Windows');
}

/**
 * macOS: Get IOPlatform UUID
 * @returns IOPlatform UUID string
 * @platform macOS
 */
export function getIOPlatformUUID(): string {
	if (typeof native.getIOPlatformUUID === 'function') {
		return native.getIOPlatformUUID();
	}
	throw new Error('getIOPlatformUUID is only available on macOS');
}

/**
 * macOS: Get IOPlatform Serial Number
 * @returns IOPlatform serial number
 * @platform macOS
 */
export function getIOPlatformSerialNumber(): string {
	if (typeof native.getIOPlatformSerialNumber === 'function') {
		return native.getIOPlatformSerialNumber();
	}
	throw new Error('getIOPlatformSerialNumber is only available on macOS');
}

/**
 * Linux: Get machine ID from /etc/machine-id or /var/lib/dbus/machine-id
 * @returns Machine ID string
 * @platform Linux
 */
export function getMachineIdLinux(): string {
	if (typeof native.getMachineIdLinux === 'function') {
		return native.getMachineIdLinux();
	}
	throw new Error('getMachineIdLinux is only available on Linux');
}

/**
 * Linux: Get product UUID from /sys/class/dmi/id/product_uuid
 * @returns Product UUID string
 * @platform Linux
 */
export function getProductUUID(): string {
	if (typeof native.getProductUUID === 'function') {
		return native.getProductUUID();
	}
	throw new Error('getProductUUID is only available on Linux');
}

/**
 * Linux: Get board serial number from /sys/class/dmi/id/board_serial
 * @returns Board serial number
 * @platform Linux
 */
export function getBoardSerial(): string {
	if (typeof native.getBoardSerial === 'function') {
		return native.getBoardSerial();
	}
	throw new Error('getBoardSerial is only available on Linux');
}

/**
 * Get all available fingerprint information for the current platform
 * @returns Object containing all available fingerprint data
 */
/**
 * Platform-specific fingerprint information
 */
export interface FingerprintInfo {
	/** Base machine ID (available on all platforms) */
	machineId: string;
	/** Windows: Machine GUID from registry */
	machineGuid?: string;
	/** Windows: BIOS UUID */
	biosUUID?: string;
	/** Windows: Base board serial number */
	baseBoardSerial?: string;
	/** macOS: IOPlatform UUID */
	ioPlatformUUID?: string;
	/** macOS: IOPlatform serial number */
	ioPlatformSerialNumber?: string;
	/** Linux: Machine ID from /etc/machine-id */
	machineIdLinux?: string;
	/** Linux: Product UUID from /sys/class/dmi/id/product_uuid */
	productUUID?: string;
	/** Linux: Board serial from /sys/class/dmi/id/board_serial */
	boardSerial?: string;
}

export function getAllFingerprints(): FingerprintInfo {
	const result: FingerprintInfo = {
		machineId: getMachineId()
	};

	// Try Windows methods
	if (typeof native.getMachineGuid === 'function') {
		try { result.machineGuid = native.getMachineGuid(); } catch { /* ignore */ }
	}
	if (typeof native.getBiosUUID === 'function') {
		try { result.biosUUID = native.getBiosUUID(); } catch { /* ignore */ }
	}
	if (typeof native.getBaseBoardSerial === 'function') {
		try { result.baseBoardSerial = native.getBaseBoardSerial(); } catch { /* ignore */ }
	}

	// Try macOS methods
	if (typeof native.getIOPlatformUUID === 'function') {
		try { result.ioPlatformUUID = native.getIOPlatformUUID(); } catch { /* ignore */ }
	}
	if (typeof native.getIOPlatformSerialNumber === 'function') {
		try { result.ioPlatformSerialNumber = native.getIOPlatformSerialNumber(); } catch { /* ignore */ }
	}

	// Try Linux methods
	if (typeof native.getMachineIdLinux === 'function') {
		try { result.machineIdLinux = native.getMachineIdLinux(); } catch { /* ignore */ }
	}
	if (typeof native.getProductUUID === 'function') {
		try { result.productUUID = native.getProductUUID(); } catch { /* ignore */ }
	}
	if (typeof native.getBoardSerial === 'function') {
		try { result.boardSerial = native.getBoardSerial(); } catch { /* ignore */ }
	}

	return result;
}