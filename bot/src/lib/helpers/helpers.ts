import { customAlphabet } from "nanoid";

const MENU_PHRASES = [
	"The hunt continues. What shall we observe next?",
	"All channels open. Choose your next target.",
	"Whispers await. Which signal shall we heed?",
	"Monitoring protocols active. Select your next action.",
	"Back to the menu... or forward into the unknown?",
	"Stalker ready. Awaiting your directive.",
	"Data flows, patterns emerge. What’s your move?",
	"Nothing escapes our gaze. What do we track now?",
	"The grid listens. What will you command?",
	"Tracking resumed. Adjust your targets as you wish."
];
export function getMenuMoodPhrase(): string {
	const index = Math.floor(Math.random() * MENU_PHRASES.length);
	return MENU_PHRASES[index];
}

export function checkStrategy(s: string): s is 'percentage' | 'absolute' {
	if (s === 'percentage') return true;
	if (s === 'absolute') return true;
	return false;
}

export function checkYesCancel(s: string): s is 'yes' | 'cancel' {
	if (s === 'yes') return true;
	if (s === 'cancel') return true;
	return false;
}

export const safeNanoId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
