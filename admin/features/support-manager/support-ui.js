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
            const bgClass = isSelected ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-200 hover:bg-gray-50';
            
            let statusBadgeColor = 'bg-gray-100 text-gray-800';
            if (ticket.status === 'Open') statusBadgeColor = 'bg-blue-100 text-blue-800';
            if (ticket.status === 'In Progress') statusBadgeColor = 'bg-amber-100 text-amber-800';
            if (ticket.status === 'Escalated') statusBadgeColor = 'bg-purple-100 text-purple-800';
            if (ticket.status === 'Resolved') statusBadgeColor = 'bg-green-100 text-green-800';

            const sentimentColor = ticket.sentiment === 'Frustrated' ? 'text-red-600 font-bold' : 'text-gray-500';

            container.innerHTML += `
                <div onclick="window.selectTicket('${ticket.id}')" class="border rounded-lg p-3 cursor-pointer transition ${bgClass} mb-2 shadow-xs">
                    <div class="flex justify-between items-start mb-1">
                        <span class="font-mono text-xs font-semibold text-gray-500">${ticket.id}</span>
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium ${statusBadgeColor}">${ticket.status}</span>
                    </div>
                    <h5 class="font-bold text-sm text-gray-800 truncate">${ticket.subject}</h5>
                    <div class="flex justify-between items-center text-xs text-gray-500 mt-1">
                        <span>${ticket.userName} • <span class="text-indigo-600">${ticket.category}</span></span>
                        <span class="${sentimentColor}"> Mood: ${ticket.sentiment}</span>
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
                <div class="bg-emerald-50/60 border border-emerald-200 rounded p-2.5 text-xs mb-2 flex justify-between items-center shadow-xs">
                    <div>
                        <span class="font-bold text-emerald-900 block capitalize">#${index + 1}: ${faq.question}</span>
                        <p class="text-emerald-700 truncate max-w-xs mt-0.5">${faq.answer}</p>
                    </div>
                    <span class="bg-emerald-200 text-emerald-900 font-mono font-bold px-2 py-1 rounded text-[10px] ml-2" title="Asked count">${faq.count} hits</span>
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
            let align = 'justify-start';
            let bubble = 'chat-bubble-user';
            if (msg.sender === 'admin') {
                align = 'justify-end';
                bubble = 'chat-bubble-admin';
            } else if (msg.sender === 'ai') {
                align = 'justify-start';
                bubble = 'chat-bubble-ai';
            } else if (msg.sender === 'system') {
                align = 'justify-center';
                bubble = 'chat-bubble-system text-xs italic';
            }

            messagesHtml += `
                <div class="flex ${align} mb-3">
                    <div class="max-w-[80%] rounded-lg px-3 py-2 text-xs shadow-xs ${bubble}">
                        <div class="flex justify-between items-center gap-4 mb-1 opacity-75 text-[10px]">
                            <span class="font-bold uppercase">${msg.sender} (${msg.lang || 'en'})</span>
                            <span>${msg.timestamp}</span>
                        </div>
                        <p>${msg.text}</p>
                    </div>
                </div>
            `;
        });

        let notesHtml = '';
        ticket.internalNotes.forEach(note => {
            notesHtml += `
                <div class="bg-amber-50 border border-amber-200 rounded p-2 text-xs mb-2">
                    <div class="flex justify-between font-bold text-amber-800 text-[10px] mb-1">
                        <span>${note.author}</span>
                        <span>${note.timestamp}</span>
                    </div>
                    <p class="text-amber-900">${note.text}</p>
                </div>
            `;
        });

        const handoffButton = !ticket.isEscalated 
            ? `<button onclick="window.triggerHandoff('${ticket.id}')" class="text-xs bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 transition font-semibold">Connect with Support Team</button>`
            : `<span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold">Handed over to Human Team</span>`;

        let cannedOptionsHtml = this.core.cannedResponses.map((c, i) => `<button onclick="window.applyCanned('${ticket.id}', ${i})" class="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-slate-300 transition">${c.title}</button>`).join(' ');

        container.innerHTML = `
            <div class="bg-white border rounded-lg shadow-sm p-4 flex flex-col h-full">
                <!-- Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b gap-3">
                    <div>
                        <div class="flex items-center space-x-2">
                            <h4 class="font-bold text-base text-gray-800">${ticket.subject}</h4>
                            <span class="font-mono text-xs text-gray-400">(${ticket.id})</span>
                        </div>
                        <p class="text-xs text-gray-500">From: <strong>${ticket.userName}</strong> (${ticket.userEmail}) • Lang: <span class="uppercase font-mono">${ticket.userLanguage}</span> • Priority: <span class="text-red-600 font-semibold">${ticket.priority}</span></p>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${handoffButton}
                        <select onchange="window.updateTicketStatus('${ticket.id}', this.value)" class="text-xs border rounded px-2 py-1 bg-gray-50 font-medium">
                            <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                            <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Escalated" ${ticket.status === 'Escalated' ? 'selected' : ''}>Escalated</option>
                            <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                            <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
                        </select>
                        <button onclick="window.deleteTicket('${ticket.id}')" class="text-red-500 hover:text-red-700 text-xs px-2 py-1"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>

                <!-- Chat Messages, Internal Notes & Session Inspector Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 my-4 overflow-hidden">
                    <!-- Conversation Thread -->
                    <div class="lg:col-span-2 flex flex-col bg-slate-50 border rounded-lg p-3 h-72 overflow-y-auto">
                        <div class="flex-1">${messagesHtml}</div>
                    </div>
                    <!-- Internal Notes & Device Context Inspector -->
                    <div class="flex flex-col gap-3 h-72 overflow-y-auto">
                        <div class="bg-sky-50 border border-sky-200 rounded p-2 text-xs">
                            <h6 class="font-bold text-sky-900 mb-1 uppercase text-[10px]">Session Context Inspector</h6>
                            <p class="text-sky-800">Browser: ${ticket.sessionContext.browser}</p>
                            <p class="text-sky-800">OS: ${ticket.sessionContext.os} (${ticket.sessionContext.device})</p>
                            <p class="text-sky-800 truncate">Page: ${ticket.sessionContext.page}</p>
                        </div>
                        <div class="bg-amber-50/40 border border-amber-200 rounded p-2 flex-1 flex flex-col">
                            <h5 class="font-bold text-xs text-amber-900 uppercase mb-1">Internal Notes (Admin Only)</h5>
                            <div class="flex-1 overflow-y-auto">${notesHtml || '<p class="text-xs text-gray-400 italic">No notes yet.</p>'}</div>
                            <div class="mt-2">
                                <input type="text" id="internalNoteInput" placeholder="Add private note..." class="w-full text-xs border rounded px-2 py-1 mb-1 focus:outline-none focus:border-amber-500" />
                                <button onclick="window.saveInternalNote('${ticket.id}')" class="w-full text-xs bg-amber-600 text-white rounded py-1 hover:bg-amber-700 transition">Save Note</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Canned Responses Quick Bar -->
                <div class="flex items-center gap-1 mb-2 flex-wrap">
                    <span class="text-[10px] font-bold text-gray-500 uppercase mr-1">Quick Canned:</span>
                    ${cannedOptionsHtml}
                </div>

                <!-- Reply Bar -->
                <div class="pt-3 border-t flex items-center space-x-2">
                    <input type="text" id="adminReplyInput" placeholder="Type reply as admin..." class="flex-1 text-xs border rounded px-3 py-2 focus:outline-none focus:border-indigo-500" />
                    <button onclick="window.sendAdminReply('${ticket.id}')" class="text-xs bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition font-semibold">Send Reply</button>
                    <button onclick="window.triggerGoogleSheetsSync('${ticket.id}')" class="text-xs bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 transition font-semibold" title="Check Google Sheets & AI Reply">📊 Sheets AI</button>
                </div>
            </div>
        `;
    }
          }
