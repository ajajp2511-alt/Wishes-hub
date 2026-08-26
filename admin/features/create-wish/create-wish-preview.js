/**
 * Create Wish Feature - Live Staging Preview Sandbox
 * Path: admin/features/create-wish/create-wish-preview.js
 */

export class CreateWishPreview {
  constructor(previewContainerId) {
    this.container = document.getElementById(previewContainerId);
    this.viewMode = 'mobile';
  }

  setViewMode(mode) {
    if (['mobile', 'desktop'].includes(mode)) {
      this.viewMode = mode;
      this.updateContainerFrame();
    }
  }

  updateContainerFrame() {
    if (!this.container) return;
    this.container.className = `wish-preview-sandbox frame-${this.viewMode}`;
  }

  renderPreview(formData = {}) {
    if (!this.container) return;

    const { Title, Content, Image_CDN_URL, Audio_CDN_URL, Category, Tone } = formData;

    let mediaHtml = '';
    if (Image_CDN_URL) {
      mediaHtml += `<img src="${Image_CDN_URL}" alt="Wish Media" class="preview-media-img" />`;
    }
    if (Audio_CDN_URL) {
      mediaHtml += `<audio controls src="${Audio_CDN_URL}" class="preview-media-audio"></audio>`;
    }

    this.container.innerHTML = `
      <div class="wish-card-staging tone-${Tone || 'default'}">
        <div class="staging-header">
          <span class="badge-category">${Category || 'Text'} Wish</span>
          <span class="view-indicator">${this.viewMode.toUpperCase()} VIEW</span>
        </div>
        <div class="staging-body">
          <h3 class="preview-title">${Title || 'Your Title Here...'}</h3>
          ${mediaHtml}
          <p class="preview-content">${Content || 'Your wish message content will appear here in real-time.'}</p>
        </div>
        <div class="staging-footer">
          <button class="btn-preview-interactive">Send Wish</button>
        </div>
      </div>
    `;
  }
}

export const createWishPreviewInstance = new CreateWishPreview('wish-staging-container');
