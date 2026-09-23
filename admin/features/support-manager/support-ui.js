export class SupportUI {
    constructor(core, handlers) {
        this.core = core;
        this.handlers = handlers;
        this.activeTicketId = 'TICK-1001';
        this.statusFilter = 'All';
    }

    init() {
        this.render();
    }

    render() {
        this.renderTicketList();
        this.renderTrendingFAQs();
        if (this.activeTicketId) {
            this.renderTicketDetail(this.activeTicketId);
        }
    }

    renderTicketList() {
        const container = document.getElementById('ticketListContainer');
        if (!container) return;

        container.innerHTML = '';
        const tickets = this.core.getTickets();

        tickets.forEach(ticket => {
            if (this.statusFilter !== 'All' && ticket.status !== this.statusFilter) return;

            const isSelected = ticket.id === this.activeTicketId;
            const activeClass = isSelected ? 'ticket-card-active' : '';
            
            let statusBadgeClass = 'flag-badge-inactive';
            if (ticket.status === 'Open' || ticket.status === 'In Progress') statusBadgeClass = 'flag-badge-active';
            if (ticket.status === 'Resolved') statusBadgeClass = 'flag-badge-active';

            const sentimentColor = ticket.sentiment === 'Frustrated' ? 'text-red-400 font-bold' : 'text-slate-400';

            container.innerHTML += `
                <div onclick="window.selectTicket('${ticket.id}')" class="ticket-card ${activeClass} mb-2">
                    <div class="flex justify-between items-start mb-1">
                        <span class="font-mono text-xs font-semibold text-slate-400">${ticket.id}</span>
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium ${statusBadgeClass}">${ticket.status}</span>
                    </div>
                    <h5 class="font-bold text-sm text-slate-100 truncate">${ticket.subject}</h5>
                    <div class="flex justify-between items-center text-xs text-slate-400 mt-1">
                        <span>${ticket.userName} • <span class="text-indigo-400">${ticket.category}</span></span>
                        <span class="${sentimentColor}">Mood: ${ticket.sentiment}</span>
                    </div>
                </div>
            `;
        });
    }

    renderTrendingFAQs() {
        const container = document.getElementById('trendingFAQContainer');
        if (!container) return;

        container.innerHTML = '';
        const faqs = this.core.getGoogleSheetsFAQs();

        faqs.forEach((faq, index) => {
            container.innerHTML += `
                <div style="background: rgba(6, 78, 59, 0.3); border: 1px solid rgba(5, 150, 105, 0.3); border-radius: 12px; padding: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span class="font-bold text-emerald-300 block capitalize text-xs">#${index + 1}: ${faq.question}</span>
                        <p class="text-emerald-400 truncate max-w-xs mt-0.5 text-xs">${faq.answer}</p>
                    </div>
                    <span style="background: #064e3b; color: #6ee7b7; font-family: monospace; font-weight: bold; padding: 4px 8px; border-radius: 6px; font-size: 10px;" title="Asked count">${faq.count} hits</span>
                </div>
            `;
        });
    }

    renderTicketDetail(ticketId) {
        this.activeTicketId = ticketId;
        const container = document.getElementById('ticketDetailContainer');
        if (!container) return;

        const ticket = this.core.getTicketById(ticketId);
        if (!ticket) return;

        let messagesHtml = '';
        ticket.messages.forEach(msg => {
            let bubbleClass = 'chat-bubble-user';
            if (msg.sender === 'admin') {
                bubbleClass = 'chat-bubble-admin';
            } else if (msg.sender === 'ai') {
                bubbleClass = 'chat-bubble-ai';
            } else if (msg.sender === 'system') {
                bubbleClass = 'chat-bubble-system';
            }

            messagesHtml += `
                <div class="chat-bubble ${bubbleClass} mb-3">
                    <div class="flex justify-between items-center gap-4 mb-1 opacity-75 text-[10px]">
                        <span class="font-bold uppercase">${msg.sender} (${msg.lang || 'en'})</span>
                        <span>${msg.timestamp}</span>
                    </div>
                    <p>${msg.text}</p>
                </div>
            `;
        });

        let notesHtml = '';
        ticket.internalNotes.forEach(note => {
            notesHtml += `
                <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 8px; margin-bottom: 8px; font-size: 0.8rem;">
                    <div class="flex justify-between font-bold text-amber-400 text-[10px] mb-1">
                        <span>${note.author}</span>
                        <span>${note.timestamp}</span>
                    </div>
                    <p class="text-amber-200">${note.text}</p>
                </div>
            `;
        });

        const handoffButton = !ticket.isEscalated 
            ? `<button onclick="window.triggerHandoff('${ticket.id}')" class="text-xs bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 transition font-semibold">Connect with Support Team</button>`
            : `<span class="text-xs bg-purple-900 text-purple-200 px-2 py-1 rounded font-semibold">Handed over to Human Team</span>`;

        let cannedOptionsHtml = this.core.cannedResponses.map((c, i) => `<button onclick="window.applyCanned('${ticket.id}', ${i})" class="canned-btn">${c.title}</button>`).join(' ');

        container.innerHTML = `
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; height: 100%;">
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b border-slate-700 gap-3">
                    <div>
                        <div class="flex items-center space-x-2">
                            <h4 class="font-bold text-base text-slate-100">${ticket.subject}</h4>
                            <span class="font-mono text-xs text-slate-400">(${ticket.id})</span>
                        </div>
                        <p class="text-xs text-slate-400">From: <strong>${ticket.userName}</strong> (${ticket.userEmail}) • Lang: <span class="uppercase font-mono">${ticket.userLanguage}</span> • Priority: <span class="text-red-400 font-semibold">${ticket.priority}</span></p>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${handoffButton}
                        <select onchange="window.updateTicketStatus('${ticket.id}', this.value)" class="text-xs border border-slate-600 rounded px-2 py-1 bg-slate-800 text-slate-200 font-medium">
                            <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                            <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Escalated" ${ticket.status === 'Escalated' ? 'selected' : ''}>Escalated</option>
                            <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                            <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
                        </select>
                        <button onclick="window.deleteTicket('${ticket.id}')" class="text-red-400 hover:text-red-300 text-xs px-2 py-1"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>

                <!-- Chat Messages & Inspector Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 my-4 overflow-hidden">
                    <div class="lg:col-span-2 flex flex-col chat-container">
                        <div class="flex-1 flex flex-col gap-2">${messagesHtml}</div>
                    </div>
                    <div class="flex flex-col gap-3 h-72 overflow-y-auto">
                        <div style="background: rgba(14, 116, 144, 0.2); border: 1px solid rgba(14, 116, 144, 0.4); border-radius: 8px; padding: 10px; font-size: 0.8rem;">
                            <h6 class="font-bold text-cyan-300 mb-1 uppercase text-[10px]">Session Context Inspector</h6>
                            <p class="text-cyan-200">Browser: ${ticket.sessionContext.browser}</p>
                            <p class="text-cyan-200">OS: ${ticket.sessionContext.os} (${ticket.sessionContext.device})</p>
                            <p class="text-cyan-200 truncate">Page: ${ticket.sessionContext.page}</p>
                        </div>
                        <div style="background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 10px; flex: 1; display: flex; flex-direction: column;">
                            <h5 class="font-bold text-xs text-amber-300 uppercase mb-1">Internal Notes (Admin Only)</h5>
                            <div class="flex-1 overflow-y-auto">${notesHtml || '<p class="text-xs text-slate-500 italic">No notes yet.</p>'}</div>
                            <div class="mt-2">
                                <input type="text" id="internalNoteInput" placeholder="Add private note..." class="w-full text-xs border border-slate-600 bg-slate-900 text-slate-200 rounded px-2 py-1 mb-1 focus:outline-none focus:border-amber-500" />
                                <button onclick="window.saveInternalNote('${ticket.id}')" class="w-full text-xs bg-amber-600 text-white rounded py-1 hover:bg-amber-700 transition font-semibold">Save Note</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Canned Responses Quick Bar -->
                <div class="flex items-center gap-1 mb-2 flex-wrap">
                    <span class="text-[10px] font-bold text-slate-400 uppercase mr-1">Quick Canned:</span>
                    ${cannedOptionsHtml}
                </div>

                <!-- Reply Bar -->
                <div class="pt-3 border-t border-slate-700 flex items-center space-x-2">
                    <input type="text" id="adminReplyInput" placeholder="Type reply as admin..." class="flex-1 text-xs border border-slate-600 bg-slate-900 text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-indigo-500" />
                    <button onclick="window.sendAdminReply('${ticket.id}')" class="text-xs bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition font-semibold">Send Reply</button>
                    <button onclick="window.triggerGoogleSheetsSync('${ticket.id}')" class="text-xs bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 transition font-semibold" title="Check Google Sheets & AI Reply">📊 Sheets AI</button>
                </div>
            </div>
        `;
    }
}
