import { handleSentimentCheck } from './sentiment-analysis.js';

export function handleAddReply(core, ui, ticketId, messageText) {
    if (!messageText.trim()) return;
    const success = core.addMessage(ticketId, 'admin', messageText);
    if (success) {
        ui.renderTicketDetail(ticketId);
        ui.renderTicketList();
    }
}
