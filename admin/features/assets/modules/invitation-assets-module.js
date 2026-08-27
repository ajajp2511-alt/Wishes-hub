/**
 * Invitation Card Asset Sub-Module
 * Path: admin/features/assets/modules/invitation-asset-module.js
 */

export class InvitationAssetModule {
  static getSchema() {
    return {
      id: '',
      cardName: '',
      previewImageUrl: '',
      templateHtmlUrl: '',
      theme: 'Birthday',
      tags: ['#invitation_card']
    };
  }

  static renderCard(item) {
    return `
      <div class="asset-card invitation-card" data-id="${item.id}">
        <div class="card-preview image-preview">
          <img src="${item.previewImageUrl || 'https://via.placeholder.com/150'}" alt="${item.cardName || 'Card'}" />
        </div>
        <div class="card-info">
          <h4>${item.cardName || item.id}</h4>
          <p>Theme: ${item.theme || 'General'}</p>
        </div>
      </div>
    `;
  }
}
