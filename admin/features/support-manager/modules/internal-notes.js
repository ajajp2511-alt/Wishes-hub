export function handleAddInternalNote(core, ui, ticketId, noteText) {
    if (!noteText.trim()) return;
    const success = core.addInternalNote(ticketId, 'Current Admin', noteText);
    if (success) {
        ui.renderTicketDetail(ticketId);
    }
}
