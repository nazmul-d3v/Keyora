/**
 * Calculates typing accuracy percentage
 *
 * @param correctChars Count of correctly typed characters
 * @param totalChars Count of all typed characters
 * @returns Accuracy percentage between 0 and 100
 */
export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars <= 0) return 100;
  const accuracy = (correctChars / totalChars) * 100;
  return Math.min(100, Math.max(0, Math.round(accuracy * 10) / 10));
}

/**
 * Calculates Consistency percentage based on WPM variation across timeline seconds
 *
 * @param timeline Array of WPM readings per second
 * @returns Consistency percentage (0 - 100%)
 */
export function calculateConsistency(timeline: { wpm: number }[]): number {
  if (timeline.length < 2) return 100;
  
  const values = timeline.map(t => t.wpm).filter(v => v > 0);
  if (values.length < 2) return 100;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 100;

  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Coefficient of Variation = (stdDev / mean) * 100
  // Higher variation means lower consistency
  const cv = (stdDev / mean) * 100;
  const consistency = Math.max(0, Math.min(100, 100 - cv));

  return Math.round(consistency * 10) / 10;
}

export default calculateAccuracy;
