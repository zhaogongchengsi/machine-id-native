import getMachineId, { getAllFingerprints } from '../dist/index.mjs';

console.log('=== Machine Fingerprint Test ===\n');

// Test main function
console.log('Main Machine ID:');
try {
	const machineId = getMachineId();
	console.log('✓ getMachineId():', machineId);
} catch (error) {
	console.error('✗ getMachineId() failed:', error);
}

console.log('\n=== All Fingerprints ===');
try {
	const fingerprints = getAllFingerprints();
	console.log('Available fingerprints:');
	for (const [key, value] of Object.entries(fingerprints)) {
		console.log(`  ${key}: ${value}`);
	}
	console.log(`\nTotal fingerprints: ${Object.keys(fingerprints).length}`);
} catch (error) {
	console.error('✗ getAllFingerprints() failed:', error);
}

console.log('\n=== Platform-Specific Tests ===');

// Test platform detection
const platform = process.platform;
console.log(`Platform: ${platform}\n`);

if (platform === 'win32') {
	console.log('Testing Windows methods:');
	try {
		const { getMachineGuid, getBiosUUID, getBaseBoardSerial } = await import('../dist/index.mjs');
		
		try {
			console.log('  getMachineGuid():', getMachineGuid());
		} catch (e) {
			console.log('  getMachineGuid(): Not available');
		}
		
		try {
			console.log('  getBiosUUID():', getBiosUUID());
		} catch (e) {
			console.log('  getBiosUUID(): Not available');
		}
		
		try {
			console.log('  getBaseBoardSerial():', getBaseBoardSerial());
		} catch (e) {
			console.log('  getBaseBoardSerial(): Not available');
		}
	} catch (error) {
		console.error('  Error importing Windows methods:', error);
	}
} else if (platform === 'darwin') {
	console.log('Testing macOS methods:');
	try {
		const { getIOPlatformUUID, getIOPlatformSerialNumber } = await import('../dist/index.mjs');
		
		try {
			console.log('  getIOPlatformUUID():', getIOPlatformUUID());
		} catch (e) {
			console.log('  getIOPlatformUUID(): Not available');
		}
		
		try {
			console.log('  getIOPlatformSerialNumber():', getIOPlatformSerialNumber());
		} catch (e) {
			console.log('  getIOPlatformSerialNumber(): Not available');
		}
	} catch (error) {
		console.error('  Error importing macOS methods:', error);
	}
} else if (platform === 'linux') {
	console.log('Testing Linux methods:');
	try {
		const { getMachineIdLinux, getProductUUID, getBoardSerial } = await import('../dist/index.mjs');
		
		try {
			console.log('  getMachineIdLinux():', getMachineIdLinux());
		} catch (e) {
			console.log('  getMachineIdLinux(): Not available');
		}
		
		try {
			console.log('  getProductUUID():', getProductUUID());
		} catch (e) {
			console.log('  getProductUUID(): Not available');
		}
		
		try {
			console.log('  getBoardSerial():', getBoardSerial());
		} catch (e) {
			console.log('  getBoardSerial(): Not available');
		}
	} catch (error) {
		console.error('  Error importing Linux methods:', error);
	}
}

console.log('\n=== Test Complete ===');
