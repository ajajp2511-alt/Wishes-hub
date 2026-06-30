/**
 * Home Page Rows (Trending & Latest) Handler
 * Path: public/features/wishes/home-rows.js
 */
import { createWishCard } from './wish-card.js';

// 1. Trending Wishes Row (Horizontal Slider Layout)
export function renderTrendingRow(containerId, trendingData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let cardsHTML = trendingData.map(wish => createWishCard(wish)).join('');
    
    container.innerHTML = `
        <div class="section-header">
            <h2>Trending Wishes 🔥</h2>
            <a href="/trending" class="view-all-btn">View All ></a>
        </div>
        <div class="horizontal-slider">
            ${cardsHTML}
        </div>
    `;
}

// 2. Latest Wishes Row (Grid Layout)
export function renderLatestGrid(containerId, latestData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let cardsHTML = latestData.map(wish => createWishCard(wish)).join('');

    container.innerHTML = `
        <div class="section-header">
            <h2>Latest Wishes 🌟</h2>
            <a href="/latest" class="view-all-btn">View All ></a>
        </div>
        <div class="wishes-grid">
            ${cardsHTML}
        </div>
    `;
}
