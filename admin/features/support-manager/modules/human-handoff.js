export function handleHumanHandoff(core, ui, ticketId) {
    const success = core.escalateToTeam(ticketId);
    if (success) {
        alert('Ticket successfully escalated to the Human Support Team!');
        ui.renderTicketDetail(ticketId);
        ui.renderTicketList();
    }
}
