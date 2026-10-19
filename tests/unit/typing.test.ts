import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateNetWPM, calculateRawWPM } from '../../src/utils/calculateWPM';
import { calculateAccuracy, calculateConsistency } from '../../src/utils/calculateAccuracy';
import { formatTime, formatDurationHuman } from '../../src/utils/formatTime';

describe('Typing Calculation Utilities', () => {
  it('calculates Net WPM accurately', () => {
    // 250 correct characters in 60 seconds = (250 / 5) / 1 min = 50 WPM
    const wpm = calculateNetWPM(250, 60);
    assert.strictEqual(wpm, 50);

    // 150 correct characters in 30 seconds = (150 / 5) / 0.5 min = 60 WPM
    const wpm30 = calculateNetWPM(150, 30);
    assert.strictEqual(wpm30, 60);

    // 0 elapsed time returns 0
    assert.strictEqual(calculateNetWPM(100, 0), 0);
  });

  it('calculates Raw WPM accurately', () => {
    // 300 total characters in 60 seconds = 60 WPM
    const raw = calculateRawWPM(300, 60);
    assert.strictEqual(raw, 60);
  });

  it('calculates Accuracy percentage correctly', () => {
    // 95 correct out of 100 total = 95%
    const acc = calculateAccuracy(95, 100);
    assert.strictEqual(acc, 95);

    // 0 total returns 100%
    assert.strictEqual(calculateAccuracy(0, 0), 100);

    // Clamps to 100% max
    assert.strictEqual(calculateAccuracy(120, 100), 100);
  });

  it('calculates consistency rating', () => {
    const steady = [
      { wpm: 80 },
      { wpm: 80 },
      { wpm: 80 },
      { wpm: 80 },
    ];
    const score = calculateConsistency(steady);
    assert.strictEqual(score, 100);
  });

  it('formats time and durations appropriately', () => {
    assert.strictEqual(formatTime(65), '01:05');
    assert.strictEqual(formatTime(9), '00:09');
    assert.strictEqual(formatDurationHuman(45), '45s');
    assert.strictEqual(formatDurationHuman(120), '2m');
  });
});
