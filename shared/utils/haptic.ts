// haptic.ts

/**
 * Checks if the vibration API is supported by the browser.
 * @returns {boolean} True if supported, false otherwise.
 */
export function isVibrationSupported(): boolean {
    return "vibrate" in navigator;
}

/**
 * Triggers haptic feedback using the vibration API.
 * @param {number | number[]} pattern - The duration or pattern of vibrations in milliseconds.
 */
export function triggerHapticFeedback(pattern: number | number[]): void {
    // Check if the vibration API is supported by the browser
    if (isVibrationSupported()) {
        // Vibrate based on the provided pattern
        navigator.vibrate(pattern);
    } else {
        // Fallback for browsers that do not support the vibration API
        console.warn("Vibration API not supported");
    }
}

// Haptic Patterns Constants
export const HAPTIC_SUCCESS: number = 50;
export const HAPTIC_ERROR: number[] = [50, 100, 50];
export const HAPTIC_NOTIFICATION: number[] = [50, 100, 50, 200, 50];
export const HAPTIC_WARNING: number[] = [200, 50, 100, 50];
export const HAPTIC_CONFIRMATION: number[] = [50, 100, 50, 200];
