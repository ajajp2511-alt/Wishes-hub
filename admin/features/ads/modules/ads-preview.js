/**
 * Wishes Hub - Live Ad Banner Preview Sandbox
 * File: admin/features/ads/modules/ads-preview.js
 * Description: Renders instant mobile & desktop responsive mockups
 *              for image banners and short video ads.
 */

export class AdsPreview {
  /**
   * Render Live Responsive Sandbox Preview
   * @param {HTMLElement} parentContainer 
   * @param {Object} adData 
   */
  renderPreview(parentContainer, adData) {
    const previewBox = document.createElement('div');
    previewBox.className = 'ads-preview-sandbox';

    const isVideo = adData.format === 'video';

    previewBox.innerHTML = `
      <div class="ads-preview-header">
        <h4>Live Screen Preview (${adData.zoneId})</h4>
      </div>
      <div class="ads-mockup-frame">
        ${isVideo ? `
          <video src="${adData.creativeUrl || '#'}" controls autoplay loop class="ads-preview-media"></video>
        ` : `
          <img src="${adData.creativeUrl || 'https://cdn.wishes-hub.com/sample-ad.jpg'}" alt="Preview" class="ads-preview-media" />
        `}
        <div class="ads-preview-overlay">
          <span>Sponsored by ${adData.businessName || 'Local Partner'}</span>
        </div>
      </div>
    `;

    parentContainer.appendChild(previewBox);
  }
}
