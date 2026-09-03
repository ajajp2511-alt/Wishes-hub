import { SupportCore } from './support-core.js';
import { SupportUI } from './support-ui.js';
import { handleAddReply } from './modules/add-reply.js';
import { handleAddInternalNote } from './modules/internal-notes.js';
import { handleUpdateStatus } from './modules/update-status.js';
import { handleAssignTicket } from './modules/assign-ticket.js';
import { handleDeleteTicket } from './modules/delete-archive.js';
import { handleGoogleSheetsSync } from './modules/google-sheets-sync.js';
import { handleHumanHandoff } from './modules/human-handoff.js';
import { handleApplyCannedResponse } from './modules/canned-responses.js';

const core = new SupportCore();
const ui = new SupportUI(core, {});

// Expose handlers globally
window.selectTicket = (id) => ui.renderTicketDetail(id);
window.sendAdminReply = (id) => {
    const input = document.getElementById('adminReplyInput');
    handleAddReply(core, ui, id, input.value);
    input.value = '';
};
window.saveInternalNote = (id) => {
    const input = document.getElementById('internalNoteInput');
    handleAddInternalNote(core, ui, id, input.value);
    input.value = '';
};
window.updateTicketStatus = (id, status) => handleUpdateStatus(core, ui, id, status);
window.assignTicketTo = (id, assignee) => handleAssignTicket(core, ui, id, assignee);
window.deleteTicket = (id) => handleDeleteTicket(core, ui, id);
window.triggerGoogleSheetsSync = (id) => {
    const lastMsg = core.getTicketById(id).messages.slice(-1)[0]?.text || 'Help query';
    handleGoogleSheetsSync(core, ui, id, lastMsg);
};
window.triggerHandoff = (id) => handleHumanHandoff(core, ui, id);
window.applyCanned = (id, index) => handleApplyCannedResponse(core, ui, id, index);

document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});
