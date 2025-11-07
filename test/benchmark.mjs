import getMachineId from '../dist/index.mjs';

console.log('=== Machine ID Benchmark ===\n');

// Single execution
console.time('Single execution');
const id = getMachineId();
console.timeEnd('Single execution');
console.log('Machine ID:', id);
console.log('Length:', id.length, 'characters\n');

// Multiple executions
const iterations = 10000;
console.log(`Running ${iterations} iterations...\n`);

console.time(`${iterations} executions`);
for (let i = 0; i < iterations; i++) {
	getMachineId();
}
console.timeEnd(`${iterations} executions`);

// Calculate average
const start = performance.now();
for (let i = 0; i < iterations; i++) {
	getMachineId();
}
const end = performance.now();
const avgTime = (end - start) / iterations;

console.log(`\nAverage time per call: ${avgTime.toFixed(4)} ms`);
console.log(`Calls per second: ${Math.round(1000 / avgTime)}`);

// Verify consistency
console.log('\n=== Consistency Check ===');
const ids = new Set();
for (let i = 0; i < 100; i++) {
	ids.add(getMachineId());
}
console.log(`Unique IDs from 100 calls: ${ids.size}`);
console.log(`All calls returned same ID: ${ids.size === 1 ? '✓ PASS' : '✗ FAIL'}`);
