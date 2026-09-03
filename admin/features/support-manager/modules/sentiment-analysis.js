export function handleSentimentCheck(core, ticketId, text) {
    core.analyzeSentimentAndUrgency(ticketId, text);
}
