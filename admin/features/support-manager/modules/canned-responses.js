export function handleApplyCannedResponse(core, ui, ticketId, cannedIndex) {
    const response = core.cannedResponses[cannedIndex];
    if (response) {
        const input = document.getElementById('adminReplyInput');
        if (input) input.value = response.text;
    }
}
