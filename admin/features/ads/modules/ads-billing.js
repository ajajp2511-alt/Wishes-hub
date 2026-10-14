/**
 * Wishes Hub - Dynamic Billing, Rate & Invoice Engine
 * File: admin/features/ads/modules/ads-billing.js
 * Description: Package pricing manager, add-on credit tracker,
 *              and automated PDF/WhatsApp invoice receipt generator.
 */

import { ADS_CONFIG } from '../ads-config.js';

export class AdsBilling {
  constructor(coreInstance) {
    this.core = coreInstance;
  }

  /**
   * Generate Printable / Downloadable Invoice Statement for Local Business
   * @param {Object} liveAdRecord 
   * @returns {Object} Invoice Details
   */
  generateInvoice(liveAdRecord) {
    const invoiceNumber = 'INV-WH-' + Math.floor(100000 + Math.random() * 900000);
    const issueDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const subtotal = liveAdRecord.billingAmount || 0;
    const aiExtra = liveAdRecord.aiExtraCharges || 0;
    const totalPayable = subtotal + aiExtra;

    return {
      invoiceNumber,
      issueDate,
      billTo: {
        businessName: liveAdRecord.businessName,
        contactName: liveAdRecord.contactName,
        whatsapp: liveAdRecord.whatsapp,
        city: liveAdRecord.city
      },
      campaignSummary: {
        adId: liveAdRecord.adId,
        zone: liveAdRecord.zoneId,
        format: liveAdRecord.format,
        durationDays: liveAdRecord.durationDays,
        coverageArea: liveAdRecord.areaScope
      },
      itemizedBreakdown: [
        { description: `Local Ad Placement (${liveAdRecord.durationDays} Days)`, amount: subtotal },
        ...(aiExtra > 0 ? [{ description: 'AI Re-generation Additional Fee', amount: aiExtra }] : [])
      ],
      totalAmountINR: totalPayable,
      paymentStatus: liveAdRecord.isFreeAd ? 'COMPLIMENTARY_FREE' : 'PAID'
    };
  }

  /**
   * Render HTML Printable Invoice Modal
   * @param {HTMLElement} parentContainer 
   * @param {Object} invoiceData 
   */
  renderInvoiceModal(parentContainer, invoiceData) {
    const modal = document.createElement('div');
    modal.className = 'ads-invoice-modal-overlay';

    modal.innerHTML = `
      <div class="ads-invoice-card">
        <div class="ads-inv-header">
          <div>
            <h2>WISHES HUB LOCAL ADS</h2>
            <p>Patel Studio Digital Media Network</p>
          </div>
          <div class="ads-inv-meta">
            <h3>INVOICE</h3>
            <p><strong>Ref:</strong> ${invoiceData.invoiceNumber}</p>
            <p><strong>Date:</strong> ${invoiceData.issueDate}</p>
          </div>
        </div>

        <hr />

        <div class="ads-inv-billing-info">
          <h4>Billed To:</h4>
          <p><strong>${invoiceData.billTo.businessName}</strong> (${invoiceData.billTo.contactName})</p>
          <p>City: ${invoiceData.billTo.city} | WhatsApp: ${invoiceData.billTo.whatsapp}</p>
        </div>

        <table class="ads-inv-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.itemizedBreakdown.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>₹${item.amount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="ads-inv-total">
          <span>Total Amount:</span>
          <strong>₹${invoiceData.totalAmountINR}</strong>
        </div>

        <div class="ads-inv-actions">
          <button onclick="window.print()" class="ads-btn-secondary">Print / Download PDF</button>
          <button id="ads-close-inv" class="ads-btn-primary">Close</button>
        </div>
      </div>
    `;

    parentContainer.appendChild(modal);
    modal.querySelector('#ads-close-inv').addEventListener('click', () => modal.remove());
  }
}
