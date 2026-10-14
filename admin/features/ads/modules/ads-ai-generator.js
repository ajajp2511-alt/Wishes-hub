/**
 * Wishes Hub - AI Banner & Video Generator Module
 * File: admin/features/ads/modules/ads-ai-generator.js
 * Description: AI creation studio with 1-free retry limit, client preview window,
 *              and paid credit guard for 2nd attempt onwards.
 */

import { ADS_CONFIG } from '../ads-config.js';

export class AdsAiGenerator {
  constructor(coreInstance) {
    this.core = coreInstance;
  }

  /**
   * Process AI Ad Generation with Credit & Retry Guard
   * @param {Object} requestRecord 
   * @param {string} promptText 
   * @returns {Promise<Object>} Generated Asset Info
   */
  async generateAiCreative(requestRecord, promptText) {
    const retriesUsed = requestRecord.aiRetriesUsed || 0;
    const maxFree = ADS_CONFIG.AI_GENERATOR.MAX_FREE_RETRIES;

    let isPaidRetry = false;
    let extraCharge = 0;

    // Check retry limits
    if (retriesUsed >= maxFree) {
      isPaidRetry = true;
      extraCharge = ADS_CONFIG.AI_GENERATOR.PAID_RETRY_COST_INR;
    }

    console.log(`[AdsAiGenerator] Generating AI Asset. Attempt #${retriesUsed + 1}. Paid: ${isPaidRetry}`);

    // Simulated AI Processing Pipeline (e.g., Image or Video Rendering)
    const mockAssetUrl = requestRecord.format === 'video'
      ? 'https://cdn.wishes-hub.com/sample-ai-ad-video.mp4'
      : 'https://cdn.wishes-hub.com/sample-ai-ad-banner.jpg';

    // Update retry counter in request record
    requestRecord.aiRetriesUsed = retriesUsed + 1;
    if (isPaidRetry) {
      requestRecord.aiExtraCharges = (requestRecord.aiExtraCharges || 0) + extraCharge;
    }

    return {
      assetUrl: mockAssetUrl,
      promptUsed: promptText,
      attemptNumber: requestRecord.aiRetriesUsed,
      isFreeRetry: !isPaidRetry,
      extraChargeAdded: extraCharge,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Render AI Creation Modal & Sandbox Preview for Advertiser Approval
   * @param {HTMLElement} parentContainer 
   * @param {Object} requestRecord 
   * @param {Function} onApproveCallback 
   */
  renderStudioModal(parentContainer, requestRecord, onApproveCallback) {
    const modal = document.createElement('div');
    modal.className = 'ads-ai-modal-overlay';
    
    const retriesUsed = requestRecord.aiRetriesUsed || 0;
    const isNextFree = retriesUsed < ADS_CONFIG.AI_GENERATOR.MAX_FREE_RETRIES;

    modal.innerHTML = `
      <div class="ads-ai-modal-content">
        <div class="ads-modal-header">
          <h3>AI Creative Studio - Preview & Approval</h3>
          <button class="ads-modal-close">&times;</button>
        </div>

        <div class="ads-modal-body">
          <p><strong>Shop:</strong> ${requestRecord.businessName}</p>
          
          <div id="ads-ai-preview-window" class="ads-preview-box">
            <div class="ads-preview-placeholder">Click 'Generate Design' to create first draft.</div>
          </div>

          <div class="ads-ai-controls">
            <input type="text" id="ads-ai-prompt" placeholder="e.g., Diwali special sweet sale with 20% discount background" />
            <div class="ads-ai-status">
              ${isNextFree 
                ? `<span class="ads-badge-free">1st Re-generation is FREE</span>` 
                : `<span class="ads-badge-paid">Next Attempt Charge: ₹${ADS_CONFIG.AI_GENERATOR.PAID_RETRY_COST_INR}</span>`}
            </div>
          </div>
        </div>

        <div class="ads-modal-footer">
          <button id="ads-ai-generate-btn" class="ads-btn-secondary">Generate / Re-Generate</button>
          <button id="ads-ai-accept-btn" class="ads-btn-primary" disabled>Approve Design & Continue</button>
        </div>
      </div>
    `;

    parentContainer.appendChild(modal);

    let currentGeneratedAsset = null;

    const closeBtn = modal.querySelector('.ads-modal-close');
    const generateBtn = modal.querySelector('#ads-ai-generate-btn');
    const acceptBtn = modal.querySelector('#ads-ai-accept-btn');
    const promptInput = modal.querySelector('#ads-ai-prompt');
    const previewWindow = modal.querySelector('#ads-ai-preview-window');

    closeBtn.addEventListener('click', () => modal.remove());

    generateBtn.addEventListener('click', async () => {
      const prompt = promptInput.value || 'Local festive business promotion banner';
      generateBtn.disabled = true;
      generateBtn.innerText = 'Rendering AI Creative...';

      currentGeneratedAsset = await this.generateAiCreative(requestRecord, prompt);

      // Render Preview
      if (requestRecord.format === 'video') {
        previewWindow.innerHTML = `
          <video controls autoplay loop style="max-width:100%; max-height:220px;">
            <source src="${currentGeneratedAsset.assetUrl}" type="video/mp4" />
          </video>
        `;
      } else {
        previewWindow.innerHTML = `
          <img src="${currentGeneratedAsset.assetUrl}" alt="AI Generated Banner" style="max-width:100%; max-height:220px; object-fit:contain;" />
        `;
      }

      generateBtn.disabled = false;
      generateBtn.innerText = 'Re-Generate AI Design';
      acceptBtn.disabled = false;
    });

    acceptBtn.addEventListener('click', () => {
      if (currentGeneratedAsset && onApproveCallback) {
        onApproveCallback(currentGeneratedAsset);
      }
      modal.remove();
    });
  }
}
