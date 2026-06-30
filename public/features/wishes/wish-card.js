/**
 * Wish Card Template Generator
 * Path: public/features/wishes/wish-card.js
 */

export function createWishCard(wishData) {
    // wishData me id, text, likes, aur category backend/API se aayegi
    const { id, text, likes, category } = wishData;

    return `
        <div class="wish-card" data-id="${id}">
            <div class="wish-card-header">
                <span class="wish-tag">#${category}</span>
                <button class="like-btn" onclick="handleLike('${id}')">
                    <span class="heart-icon">❤️</span> 
                    <span class="like-count">${likes}</span>
                </button>
            </div>
            
            <div class="wish-card-body">
                <p class="wish-text">${text}</p>
            </div>
            
            <div class="wish-card-footer">
                <button class="action-btn copy-btn" onclick="copyWishText('${id}')">
                    <span>📋 Copy</span>
                </button>
                <button class="action-btn whatsapp-btn" onclick="shareOnWhatsApp('${id}')">
                    <span>💬 WhatsApp</span>
                </button>
            </div>
        </div>
    `;
}
