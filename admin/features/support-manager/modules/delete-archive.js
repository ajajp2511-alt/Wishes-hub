export function handleDeleteTicket(core, ui, ticketId) {
    if (confirm(`Are you sure you want to delete ticket ${ticketId}?`)) {
        const success = core.deleteTicket(ticketId);
        if (success) {
            ui.renderTicketList();
            ui.renderTrendingFAQs();
            document.getElementById('ticketDetailContainer').innerHTML = '<p class="text-gray-400 text-center py-12">Select a ticket to view conversation</p>';
        }
    }
}
