const assert = require('assert');
const fs = require('fs');
const { calculateTimeRemaining } = require('./script.js');

// --- Test Cases ---

console.log('Running tests...');

// Test 1: Countdown is over
function testCountdownIsOver() {
    const target = new Date('2024-01-01T00:00:00Z');
    const now = new Date('2024-01-01T00:00:01Z');
    const result = calculateTimeRemaining(target, now);
    assert.strictEqual(result.isOver, true, 'Test Case 1 Failed: Countdown should be over.');
    console.log('Test Case 1 Passed: Countdown is over.');
}

// Test 2: Countdown is active with a specific time difference
function testSpecificTimeDifference() {
    const target = new Date('2025-01-02T12:00:00Z');
    const now = new Date('2025-01-01T10:00:00Z'); // 1 day and 2 hours before
    const result = calculateTimeRemaining(target, now);

    assert.strictEqual(result.isOver, false, 'Test Case 2 Failed: Countdown should be active.');
    assert.strictEqual(result.days, 1, 'Test Case 2 Failed: Days should be 1.');
    assert.strictEqual(result.hours, 2, 'Test Case 2 Failed: Hours should be 2.');
    assert.strictEqual(result.minutes, 0, 'Test Case 2 Failed: Minutes should be 0.');
    assert.strictEqual(result.seconds, 0, 'Test Case 2 Failed: Seconds should be 0.');
    console.log('Test Case 2 Passed: Specific time difference calculated correctly.');
}

// Test 3: Countdown with values from config.json
function testWithRealConfig() {
    const configRaw = fs.readFileSync('config.json');
    const config = JSON.parse(configRaw);
    const target = new Date(config.targetDateUTC);

    // A time exactly 1 day, 2 hours, 3 minutes, and 4 seconds before the target
    const now = new Date(target.getTime() - (1000 * 60 * 60 * 24 * 1) - (1000 * 60 * 60 * 2) - (1000 * 60 * 3) - (1000 * 4));

    const result = calculateTimeRemaining(target, now);

    assert.strictEqual(result.isOver, false, 'Test Case 3 Failed: Countdown with config should be active.');
    assert.strictEqual(result.days, 1, 'Test Case 3 Failed: Days with config should be 1.');
    assert.strictEqual(result.hours, 2, 'Test Case 3 Failed: Hours with config should be 2.');
    assert.strictEqual(result.minutes, 3, 'Test Case 3 Failed: Minutes with config should be 3.');
    assert.strictEqual(result.seconds, 4, 'Test Case 3 Failed: Seconds with config should be 4.');
    console.log('Test Case 3 Passed: Countdown with config data works as expected.');
}

// --- Run all tests ---
try {
    testCountdownIsOver();
    testSpecificTimeDifference();
    testWithRealConfig();
    console.log('\nAll tests passed successfully!');
} catch (error) {
    console.error('\nTests failed:');
    console.error(error.message);
    process.exit(1); // Exit with a failure code
}
