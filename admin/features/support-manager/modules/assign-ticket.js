export function handleAssignTicket(core, ui, ticketId, assigneeName) {
    const success = core.assignTicket(ticketId, assigneeName);
    if (success) {
        ui.renderTicketDetail(ticketId);
        ui.renderTicketList();
    }
}
