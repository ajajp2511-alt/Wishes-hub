/**
 * Wishes Hub - Local Ads List & Management Table
 * File: admin/features/ads/modules/ads-list.js
 * Description: Displays active campaigns, pending approval queue, expired,
 *              and free template ad requests with filter controls.
 */

import { ADS_CONFIG } from '../ads-config.js';

export class AdsList {
  constructor(coreInstance, approvalGuardInstance) {
    this.core = coreInstance;
    this.guard = approvalGuardInstance;
    this.container = null;
  }

  /**
   * Render Management Table UI
   * @param {HTMLElement|string} targetElement 
   */
  render(targetElement) {
    this.container = typeof targetElement === 'string' 
      ? document.querySelector(targetElement) 
      : targetElement;

    if (!this.container) return;

    const pendingRequests = this.guard.getPendingQueue();
    const activeAds = this.core.state.activeAds;

    this.container.innerHTML = `
      <div class="ads-list-wrap">
        <div class="ads-list-header">
          <h3>📢 Local Ad Campaigns & Requests</h3>
          <div class="ads-list-tabs">
            <button class="ads-tab-btn active" data-tab="pending">Pending Requests (${pendingRequests.length})</button>
            <button class="ads-tab-btn" data-tab="active">Active Ads (${activeAds.length})</button>
          </div>
        </div>

        <!-- Pending Queue Table -->
        <div id="tab-pending" class="ads-tab-content active">
          ${pendingRequests.length === 0 ? '<p class="ads-empty">No pending ad requests right now.</p>' : `
            <table class="ads-table">
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Contact / WA</th>
                  <th>Zone & Scope</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${pendingRequests.map(req => `
                  <tr>
                    <td>
                      <strong>${req.businessName}</strong>
                      ${req.isFreeRequest ? '<span class="ads-badge-free">Free Request</span>' : ''}
                    </td>
                    <td>${req.contactName}<br><small>${req.whatsapp}</small></td>
                    <td>${req.zoneId}<br><small>${req.areaScope}</small></td>
                    <td>${req.format.toUpperCase()}</td>
                    <td>${req.durationDays} Days</td>
                    <td>
                      <button class="ads-btn-approve" data-id="${req.id}">Approve</button>
                      <button class="ads-btn-reject" data-id="${req.id}">Reject</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>

        <!-- Active Ads Table -->
        <div id="tab-active" class="ads-tab-content ads-hidden">
          ${activeAds.length === 0 ? '<p class="ads-empty">No active ads running.</p>' : `
            <table class="ads-table">
              <thead>
                <tr>
                  <th>Ad ID</th>
                  <th>Business</th>
                  <th>Zone</th>
                  <th>Start Date</th>
                  <th>Billing</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${activeAds.map(ad => `
                  <tr>
                    <td><code>${ad.adId}</code></td>
                    <td><strong>${ad.businessName}</strong></td>
                    <td>${ad.zoneId}</td>
                    <td>${new Date(ad.startDate).toLocaleDateString()}</td>
                    <td>₹${ad.billingAmount}</td>
                    <td><span class="ads-badge-active">${ad.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const tabs = this.container.querySelectorAll('.ads-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');

        const tabTarget = e.target.getAttribute('data-tab');
        this.container.querySelectorAll('.ads-tab-content').forEach(c => c.classList.add('ads-hidden'));
        this.container.querySelector(`#tab-${tabTarget}`).classList.remove('ads-hidden');
      });
    });

    this.container.querySelectorAll('.ads-btn-approve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.guard.approveRequest(id);
        alert('Ad Approved and Activated!');
        this.render(this.container);
      });
    });

    this.container.querySelectorAll('.ads-btn-reject').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.guard.rejectRequest(id);
        alert('Request Rejected.');
        this.render(this.container);
      });
    });
  }
}
