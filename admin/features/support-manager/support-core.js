import { SUPPORT_CONFIG } from './support-config.js';

export class SupportCore {
    constructor() {
        // Simulated Google Sheets Knowledge Base & FAQ Database
        this.googleSheetsFAQ = [
            { question: 'how to upload custom animated greeting card', answer: 'Users can upload cards through the user dashboard media uploader, supporting GIF and MP4 formats up to 10MB.', count: 14 },
            { question: 'translation key missing in spanish layout', answer: 'You can update and add missing keys via the Global Language matrix using JSON import/export.', count: 8 },
            { question: 'how to reset admin password', answer: 'Admin password can be reset via the authentication security panel settings or core config environment file.', count: 5 }
        ];

        this.tickets = [
            {
                id: 'TICK-1001',
                userName: 'Aarav Sharma',
                userEmail: 'aarav@example.com',
                userLanguage: 'en',
                subject: 'How to upload custom animated greeting card?',
                category: 'General Inquiry',
                priority: 'Medium',
                status: 'Open',
                isEscalated: false,
                assignee: 'Unassigned',
                sentiment: 'Neutral',
                createdAt: '2026-09-02 10:30',
                sessionContext: { browser: 'Chrome 125', os: 'Windows 11', device: 'Desktop', page: '/dashboard/cards' },
                messages: [
                    { sender: 'user', text: 'Hello, I want to know how users can upload custom animated cards on Wishes Hub.', timestamp: '10:30', lang: 'en' },
                    { sender: 'ai', text: 'Hello Aarav! Users can upload cards through the user dashboard media uploader, supporting GIF and MP4 formats up to 10MB.', timestamp: '10:31', lang: 'en' }
                ],
                internalNotes: []
            },
            {
                id: 'TICK-1002',
                userName: 'Priya Verma',
                userEmail: 'priya@example.com',
                userLanguage: 'es',
                subject: 'El botón de envío no funciona en español',
                category: 'Bug Report',
                priority: 'High',
                status: 'Escalated',
                isEscalated: true,
                assignee: 'Admin Lead',
                sentiment: 'Frustrated',
                createdAt: '2026-09-02 14:15',
                sessionContext: { browser: 'Safari 17', os: 'macOS', device: 'Desktop', page: '/categories' },
                messages: [
                    { sender: 'user', text: 'El botón submit en la página principal aparece en blanco.', timestamp: '14:15', lang: 'es' },
                    { sender: 'ai', text: '[Translated from ES] The submit button on the main category page shows blank.', timestamp: '14:16', lang: 'en' },
                    { sender: 'system', text: '⚠️ User expressed frustration. Auto-escalated priority to High.', timestamp: '14:16', lang: 'en' }
                ],
                internalNotes: [
                    { author: 'Admin Lead', text: 'Checking translation JSON for Spanish locale.', timestamp: '14:25' }
                ]
            }
        ];

        this.cannedResponses = [
            { title: 'Greeting & Thanks', text: 'Thank you for reaching out to Wishes Hub Support. How can we help you today?' },
            { title: 'Bug Investigation', text: 'We have received your bug report and our engineering team is investigating the issue.' },
            { title: 'Resolution Notice', text: 'This issue has now been resolved. Please clear your cache and check again.' }
        ];
    }

    getTickets() {
        return this.tickets;
    }

    getTicketById(id) {
        return this.tickets.find(t => t.id === id);
    }

    getGoogleSheetsFAQs() {
        return this.googleSheetsFAQ.sort((a, b) => b.count - a.count);
    }

    checkGoogleSheetsAndReply(ticketId, userPrompt) {
        const ticket = this.getTicketById(ticketId);
        if (!ticket || ticket.isEscalated) return null;

        const normalizedQuery = userPrompt.toLowerCase().trim();
        
        // 1. Check Google Sheets FAQ Database first
        const matchedFAQ = this.googleSheetsFAQ.find(item => normalizedQuery.includes(item.question) || item.question.includes(normalizedQuery));

        let responseText = '';
        if (matchedFAQ) {
            matchedFAQ.count++;
            responseText = `[Source: Google Sheets Verified FAQ] ${matchedFAQ.answer}`;
        } else {
            // 2. Fallback to AI generation & Append new Q&A to Google Sheets mock DB
            responseText = this.generateAIResponseText(normalizedQuery);
            this.googleSheetsFAQ.push({
                question: normalizedQuery,
                answer: responseText,
                count: 1
            });
        }

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        ticket.messages.push({ sender: 'ai', text: responseText, timestamp: time, lang: ticket.userLanguage });
        return responseText;
    }

    generateAIResponseText(query) {
        if (query.includes('error') || query.includes('bug') || query.includes('fail')) {
            return "I notice you are facing an error. Please try clearing your browser cache or check your connection.";
        } else if (query.includes('language') || query.includes('translation')) {
            return "You can manage translations via the Global Language module in the admin panel.";
        } else if (query.includes('speed') || query.includes('slow')) {
            return "Wishes Hub utilizes optimized static assets. Ensure CDN cache is revalidated.";
        }
        return "I understand your query. Let me look into our database guidelines to assist you further.";
    }

    analyzeSentimentAndUrgency(ticketId, text) {
        const ticket = this.getTicketById(ticketId);
        if (!ticket) return;

        const lower = text.toLowerCase();
        if (lower.includes('useless') || lower.includes('broken') || lower.includes('urgent') || lower.includes('not working') || lower.includes('no funciona')) {
            ticket.sentiment = 'Frustrated';
            ticket.priority = 'High';
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            ticket.messages.push({ sender: 'system', text: '⚠️ High frustration / urgency detected. Priority auto-escalated to High.', timestamp: time, lang: 'en' });
        }
    }

    updateStatus(id, newStatus) {
        const ticket = this.getTicketById(id);
        if (ticket) {
            ticket.status = newStatus;
            return true;
        }
        return false;
    }

    addMessage(id, sender, text) {
        const ticket = this.getTicketById(id);
        if (ticket) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            ticket.messages.push({ sender, text, timestamp: time, lang: ticket.userLanguage });
            if (sender === 'user') {
                this.analyzeSentimentAndUrgency(id, text);
            }
            return true;
        }
        return false;
    }

    addInternalNote(id, author, text) {
        const ticket = this.getTicketById(id);
        if (ticket) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            ticket.internalNotes.push({ author, text, timestamp: time });
            return true;
        }
        return false;
    }

    assignTicket(id, assignee) {
        const ticket = this.getTicketById(id);
        if (ticket) {
            ticket.assignee = assignee;
            return true;
        }
        return false;
    }

    escalateToTeam(id) {
        const ticket = this.getTicketById(id);
        if (ticket) {
            ticket.isEscalated = true;
            ticket.status = 'Escalated';
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            ticket.messages.push({ sender: 'system', text: '⚠️ User requested connection with human support team. Ticket escalated.', timestamp: time, lang: 'en' });
            return true;
        }
        return false;
    }

    deleteTicket(id) {
        const index = this.tickets.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tickets.splice(index, 1);
            return true;
        }
        return false;
    }
                  }
