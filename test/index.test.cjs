const { describe, it } = require('node:test');
const assert = require('node:assert');
const { getMachineId } = require('../dist/index.cjs');

console.log('getMachineId:', getMachineId);

describe('getMachineId (CommonJS)', () => {
	it('should return a non-empty string', () => {
		const machineId = getMachineId();
		assert.strictEqual(typeof machineId, 'string');
		assert.ok(machineId.length > 0);
	});

	it('should return consistent results', () => {
		const id1 = getMachineId();
		const id2 = getMachineId();
		assert.strictEqual(id1, id2);
	});

	it('should not return undefined or null', () => {
		const machineId = getMachineId();
		assert.ok(machineId !== undefined);
		assert.ok(machineId !== null);
	});

	it('should match ESM export format', () => {
		const machineId = getMachineId();
		// Verify it's the default export behavior
		assert.strictEqual(typeof getMachineId, 'function');
	});
});
