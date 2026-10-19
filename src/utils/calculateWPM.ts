/**
 * Calculates Net Words Per Minute (WPM)
 * Standard typing definition: 1 word = 5 characters.
 *
 * @param correctChars Count of accurately typed characters
 * @param elapsedTimeSeconds Time elapsed in seconds
 * @returns Net WPM rounded to nearest integer or 1 decimal place
 */
export function calculateNetWPM(correctChars: number, elapsedTimeSeconds: number): number {
  if (elapsedTimeSeconds <= 0) return 0;
  const minutes = elapsedTimeSeconds / 60;
  const wpm = (correctChars / 5) / minutes;
  return Math.max(0, Math.round(wpm * 10) / 10);
}

/**
 * Calculates Raw / Gross Words Per Minute (all characters typed including errors)
 *
 * @param totalChars Count of all typed characters
 * @param elapsedTimeSeconds Time elapsed in seconds
 * @returns Raw WPM
 */
export function calculateRawWPM(totalChars: number, elapsedTimeSeconds: number): number {
  if (elapsedTimeSeconds <= 0) return 0;
  const minutes = elapsedTimeSeconds / 60;
  const raw = (totalChars / 5) / minutes;
  return Math.max(0, Math.round(raw * 10) / 10);
}

export default calculateNetWPM;
