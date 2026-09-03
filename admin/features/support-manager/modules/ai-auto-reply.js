import { handleGoogleSheetsSync } from './google-sheets-sync.js';

export function handleAIGenerateReply(core, ui, ticketId, promptText) {
    handleGoogleSheetsSync(core, ui, ticketId, promptText);
}
