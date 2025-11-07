import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getMachineId } from '../dist/index.mjs';

describe('getMachineId', () => {
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

	it('should return a valid format', () => {
		const machineId = getMachineId();
		// Should not contain only whitespace
		assert.ok(machineId.trim().length > 0);
		// Should not contain null bytes
		assert.ok(!machineId.includes('\0'));
	});
});
