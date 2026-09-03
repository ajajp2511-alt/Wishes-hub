export function handleGoogleSheetsSync(core, ui, ticketId, promptText) {
    const response = core.checkGoogleSheetsAndReply(ticketId, promptText);
    if (response) {
        ui.renderTicketDetail(ticketId);
        ui.renderTrendingFAQs();
    }
}
