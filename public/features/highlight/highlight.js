/**
 * Now Features (Wish of the day & Festivals) Handler
 * Path: public/features/now/now-handlers.js
 */

// 1. Render Wish of the Day (Top Highlight Banner)
export function renderWishOfTheDay(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="wish-of-the-day-banner">
            <div class="banner-badge">✨ Wish of the Day</div>
            <p class="banner-text">"${data.text}"</p>
            <div class="banner-actions">
                <button onclick="copyWishText('${data.id}')">📋 Copy</button>
                <button onclick="shareOnWhatsApp('${data.id}')" class="wa-spec">💬 WhatsApp Share</button>
            </div>
        </div>
    `;
}

// 2. Render Upcoming Festivals (Rounded Icon Horizontal Slider)
export function renderFestivalSlider(containerId, festivals) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let festivalItems = festivals.map(fest => `
        <a href="/category/${fest.slug}" class="festival-item-card">
            <div class="festival-icon-circle">
                <span>${fest.icon}</span>
            </div>
            <span class="festival-name">${fest.name}</span>
        </a>
    `).join('');

    container.innerHTML = `
        <div class="section-header">
            <h2>Upcoming Festivals 🎉</h2>
        </div>
        <div class="festival-slider-container">
            ${festivalItems}
        </div>
    `;
}
