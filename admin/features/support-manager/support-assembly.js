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
    if (input) {
        handleAddReply(core, ui, id, input.value);
        input.value = '';
    }
};
window.saveInternalNote = (id) => {
    const input = document.getElementById('internalNoteInput');
    if (input) {
        handleAddInternalNote(core, ui, id, input.value);
        input.value = '';
    }
};
window.updateTicketStatus = (id, status) => handleUpdateStatus(core, ui, id, status);
window.assignTicketTo = (id, assignee) => handleAssignTicket(core, ui, id, assignee);
window.deleteTicket = (id) => handleDeleteTicket(core, ui, id);
window.triggerGoogleSheetsSync = (id) => {
    const lastMsg = core.getTicketById(id)?.messages?.slice(-1)[0]?.text || 'Help query';
    handleGoogleSheetsSync(core, ui, id, lastMsg);
};
window.triggerHandoff = (id) => handleHumanHandoff(core, ui, id);
window.applyCanned = (id, index) => handleApplyCannedResponse(core, ui, id, index);

// Export init function using the CSS classes
export function init(containerId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    root.innerHTML = `
        <div class="support-wrapper p-4 max-w-7xl mx-auto">
            <div class="mb-4">
                <h2 class="text-xl font-bold text-gray-800 mb-1">Support Tickets</h2>
                <p class="text-xs text-gray-500">Manage user support queries, live chat, and automated FAQ syncing.</p>
            </div>
            
            <!-- Trending FAQs Container -->
            <div id="trendingFAQContainer" class="mb-4"></div>

            <div class="flex flex-col gap-4">
                <!-- Ticket List Column -->
                <div class="bg-white border border-gray-200 rounded-lg p-3 max-h-[400px] overflow-y-auto shadow-xs">
                    <h3 class="font-bold text-xs text-gray-700 uppercase mb-2">Inbox Tickets</h3>
                    <div id="ticketListContainer"></div>
                </div>

                <!-- Ticket Detail Column -->
                <div class="bg-white border border-gray-200 rounded-lg min-h-[500px]" id="ticketDetailContainer"></div>
            </div>
        </div>
    `;

    ui.init();
}

// Fallback for direct load
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('dynamic-content-root')) {
        ui.init();
    }
});
