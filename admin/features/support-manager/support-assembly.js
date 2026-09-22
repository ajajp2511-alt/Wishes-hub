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

// Export init function using inline styles
export function init(containerId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    root.innerHTML = `
        <div style="padding: 16px; max-width: 1200px; margin: 0 auto; color: #1e293b; font-family: inherit;">
            <div style="margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
                <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 4px 0;">Support Tickets</h2>
                <p style="font-size: 12px; color: #64748b; margin: 0;">Manage user support queries, live chat, and automated FAQ syncing.</p>
            </div>
            
            <!-- Trending FAQs Container -->
            <div id="trendingFAQContainer" style="margin-bottom: 16px;"></div>

            <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- Ticket List Column -->
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; max-height: 400px; overflow-y: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <h3 style="font-weight: bold; font-size: 11px; color: #475569; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">Inbox Tickets</h3>
                    <div id="ticketListContainer"></div>
                </div>

                <!-- Ticket Detail Column -->
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; min-height: 500px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" id="ticketDetailContainer"></div>
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
