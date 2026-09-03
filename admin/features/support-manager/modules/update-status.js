export function handleUpdateStatus(core, ui, ticketId, newStatus) {
    const success = core.updateStatus(ticketId, newStatus);
    if (success) {
        ui.renderTicketDetail(ticketId);
        ui.renderTicketList();
    }
}
