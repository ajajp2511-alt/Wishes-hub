/**
 * Module: pay-and-refund
 * Sub-folder: refund/
 * File: refund-approval-workflow.js
 * Description: High-value multi-step admin approval ticket engine.
 */

class RefundApprovalWorkflow {
    constructor() {
        this.tickets = new Map();
        this.highValueThreshold = 100.0; // e.g., $100 / equivalent
    }

    /**
     * Create approval ticket for high-value refunds
     */
    createTicket(params) {
        const { transactionId, userId, amount, currency = 'INR' } = params;
        const ticketId = `TKT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const ticketRecord = {
            ticketId,
            transactionId,
            userId,
            amount: parseFloat(amount),
            currency,
            status: 'PENDING_ADMIN_APPROVAL',
            createdAt: new Date().toISOString()
        };

        this.tickets.set(ticketId, ticketRecord);
        return ticketRecord;
    }

    /**
     * Approve or reject high-value refund ticket
     */
    resolveTicket(ticketId, decision, adminId) {
        const ticket = this.tickets.get(ticketId);
        if (!ticket) {
            throw new Error(`Approval ticket ${ticketId} not found.`);
        }

        ticket.status = decision.toUpperCase() === 'APPROVE' ? 'APPROVED' : 'REJECTED';
        ticket.resolvedBy = adminId;
        ticket.resolvedAt = new Date().toISOString();

        return ticket;
    }
}

module.exports = new RefundApprovalWorkflow();
