/**
 * Wishes Hub - Self-Service Local Advertiser Request Form
 * File: admin/features/ads/modules/ads-request-form.js
 * Description: Interactive public request form with dynamic live price calculation,
 *              area/pincode selector, media upload, and free option toggle.
 */

import { ADS_CONFIG } from '../ads-config.js';

export class AdsRequestForm {
  constructor(coreInstance) {
    this.core = coreInstance;
    this.container = null;
  }

  /**
   * Render Public Request Form UI inside Target Element
   * @param {HTMLElement|string} targetElement 
   */
  render(targetElement) {
    this.container = typeof targetElement === 'string' 
      ? document.querySelector(targetElement) 
      : targetElement;

    if (!this.container) {
      console.error('[AdsRequestForm] Invalid target container.');
      return;
    }

    this.container.innerHTML = `
      <div class="ads-request-card">
        <div class="ads-form-header">
          <h2>Grow Your Local Business with Wishes Hub</h2>
          <p>Promote your shop, restaurant, or service directly to local festive visitors.</p>
        </div>

        <form id="ads-public-form" class="ads-form-body">
          <!-- Business Information -->
          <div class="ads-form-section">
            <h3>1. Business Details</h3>
            <div class="ads-input-grid">
              <div class="ads-input-group">
                <label for="ad-biz-name">Business / Shop Name *</label>
                <input type="text" id="ad-biz-name" placeholder="e.g., Patel Sweet Mart" required />
              </div>
              <div class="ads-input-group">
                <label for="ad-contact-name">Owner / Contact Name *</label>
                <input type="text" id="ad-contact-name" placeholder="e.g., Rajesh Patel" required />
              </div>
              <div class="ads-input-group">
                <label for="ad-whatsapp">WhatsApp Number *</label>
                <input type="tel" id="ad-whatsapp" placeholder="e.g., 9876543210" required />
              </div>
              <div class="ads-input-group">
                <label for="ad-city">Target City / Area *</label>
                <input type="text" id="ad-city" placeholder="e.g., Pune, Laxmi Road" required />
              </div>
            </div>
          </div>

          <!-- Placement & Type Selection -->
          <div class="ads-form-section">
            <h3>2. Ad Type & Placement Zone</h3>
            <div class="ads-input-grid">
              <div class="ads-input-group">
                <label for="ad-zone-select">Ad Placement Zone</label>
                <select id="ad-zone-select">
                  ${Object.values(ADS_CONFIG.ZONES).map(z => `
                    <option value="${z.id}">${z.label} (${z.dimensions})</option>
                  `).join('')}
                </select>
              </div>
              <div class="ads-input-group">
                <label for="ad-media-type">Format</label>
                <select id="ad-media-type">
                  <option value="image">Image Banner Poster</option>
                  <option value="video">Short Video Teaser (5-10 Sec)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Dynamic Targeting & Duration Engine -->
          <div class="ads-form-section">
            <h3>3. Coverage Area & Duration</h3>
            <div class="ads-input-grid">
              <div class="ads-input-group">
                <label for="ad-area-scope">Target Radius Scope</label>
                <select id="ad-area-scope">
                  ${Object.entries(ADS_CONFIG.AREA_MULTIPLIERS).map(([key, item]) => `
                    <option value="${key}">${item.label}</option>
                  `).join('')}
                </select>
              </div>
              <div class="ads-input-group">
                <label for="ad-duration-days">Duration (Days)</label>
                <input type="number" id="ad-duration-days" min="1" max="365" value="7" />
              </div>
            </div>

            <!-- Dynamic Price Live Summary Widget -->
            <div id="ads-price-calculator-box" class="ads-price-widget">
              <!-- Live Price Injected Here -->
            </div>
          </div>

          <!-- Creative Option Mode -->
          <div class="ads-form-section">
            <h3>4. Ad Creative & Design Method</h3>
            <div class="ads-radio-options">
              <label class="ads-radio-card">
                <input type="radio" name="creative_mode" value="upload" checked />
                <div>
                  <strong>Upload My Banner/Video</strong>
                  <p>I have ready poster or MP4 video clip.</p>
                </div>
              </label>
              <label class="ads-radio-card">
                <input type="radio" name="creative_mode" value="ai" />
                <div>
                  <strong>Generate with AI Studio</strong>
                  <p>Auto-create design (1st retry free!).</p>
                </div>
              </label>
              <label class="ads-radio-card highlight-free">
                <input type="radio" name="creative_mode" value="free_sheets" />
                <div>
                  <strong>Choose Free Starter Template</strong>
                  <p>Zero budget? Select free template or request assisted edit.</p>
                </div>
              </label>
            </div>

            <!-- Media Upload Box (Conditional) -->
            <div id="ads-upload-container" class="ads-input-group ads-mt-10">
              <label for="ad-file-input">Select Image or Video File</label>
              <input type="file" id="ad-file-input" accept="image/*,video/mp4,video/webm" />
            </div>
          </div>

          <!-- Action Submission -->
          <div class="ads-form-actions">
            <button type="submit" id="ads-submit-btn" class="ads-btn-primary">
              Submit Request for Approval
            </button>
          </div>
        </form>
      </div>
    `;

    this.bindEvents();
    this.updatePriceCalculation();
  }

  /**
   * Bind Dynamic Event Listeners for Live Calculation & Form Handlers
   */
  bindEvents() {
    const form = this.container.querySelector('#ads-public-form');
    const zoneSelect = this.container.querySelector('#ad-zone-select');
    const mediaSelect = this.container.querySelector('#ad-media-type');
    const areaSelect = this.container.querySelector('#ad-area-scope');
    const durationInput = this.container.querySelector('#ad-duration-days');
    const creativeRadios = this.container.querySelectorAll('input[name="creative_mode"]');
    const uploadContainer = this.container.querySelector('#ads-upload-container');

    const recalculate = () => this.updatePriceCalculation();

    zoneSelect.addEventListener('change', recalculate);
    mediaSelect.addEventListener('change', recalculate);
    areaSelect.addEventListener('change', recalculate);
    durationInput.addEventListener('input', recalculate);

    creativeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'upload') {
          uploadContainer.style.display = 'block';
        } else {
          uploadContainer.style.display = 'none';
        }
      });
    });

    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Recalculate and Render Live Dynamic Pricing
   */
  updatePriceCalculation() {
    const zoneId = this.container.querySelector('#ad-zone-select').value;
    const isVideo = this.container.querySelector('#ad-media-type').value === 'video';
    const areaKey = this.container.querySelector('#ad-area-scope').value;
    const days = parseInt(this.container.querySelector('#ad-duration-days').value, 10) || 1;
    const creativeMode = this.container.querySelector('input[name="creative_mode"]:checked').value;

    const priceBox = this.container.querySelector('#ads-price-calculator-box');

    if (creativeMode === 'free_sheets') {
      priceBox.innerHTML = `
        <div class="ads-price-free-badge">
          <span>FREE STARTER AD</span>
          <p>₹0 Estimated Charge (Includes Free Google Sheets Catalog Access)</p>
        </div>
      `;
      return;
    }

    const price = this.core.calculateDynamicPrice(zoneId, areaKey, days, isVideo);

    priceBox.innerHTML = `
      <div class="ads-price-summary">
        <div class="ads-price-detail">
          <span>Base Rate: ₹${price.baseRatePerDay}/day</span>
          <span>Area Multiplier: ${price.areaMultiplier}x</span>
          ${price.discountAmount > 0 ? `<span class="ads-discount-tag">Discount: -₹${price.discountAmount}</span>` : ''}
        </div>
        <div class="ads-price-final">
          <span>Estimated Total:</span>
          <strong>₹${price.finalAmount}</strong>
        </div>
      </div>
    `;
  }

  /**
   * Handle Form Submission & Save Pending Draft into Core Local Storage
   */
  handleSubmit(e) {
    e.preventDefault();

    const creativeMode = this.container.querySelector('input[name="creative_mode"]:checked').value;
    const isFree = creativeMode === 'free_sheets';

    const requestData = {
      businessName: this.container.querySelector('#ad-biz-name').value,
      contactName: this.container.querySelector('#ad-contact-name').value,
      whatsapp: this.container.querySelector('#ad-whatsapp').value,
      city: this.container.querySelector('#ad-city').value,
      zoneId: this.container.querySelector('#ad-zone-select').value,
      format: this.container.querySelector('#ad-media-type').value,
      areaScope: this.container.querySelector('#ad-area-scope').value,
      durationDays: parseInt(this.container.querySelector('#ad-duration-days').value, 10) || 7,
      creativeMode: creativeMode,
      isFreeRequest: isFree
    };

    const savedRecord = this.core.savePendingRequest(requestData);

    alert(`Request Submitted Successfully!\nRequest ID: ${savedRecord.id}\nStatus: Saved in local draft queue for Admin Approval.`);
    e.target.reset();
    this.updatePriceCalculation();
  }
                    }
