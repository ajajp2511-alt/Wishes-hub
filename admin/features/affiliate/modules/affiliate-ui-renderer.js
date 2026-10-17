/**
 * @file affiliate-ui-renderer.js
 * @description UI Renderer module for generating deal cards, price comparison tables, sliders, and currency switcher widgets for Wishes Hub.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../affiliate-config', '../affiliate-core', './affiliate-currency-localizer', './affiliate-deep-link'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('../affiliate-config'),
            require('../affiliate-core'),
            require('./affiliate-currency-localizer'),
            require('./affiliate-deep-link')
        );
    } else {
        root.AffiliateUiRenderer = factory(
            root.AffiliateConfig, 
            root.AffiliateCore, 
            root.AffiliateCurrencyLocalizer, 
            root.AffiliateDeepLink
        );
    }
}(typeof self !== 'undefined' ? self : this, function (AffiliateConfig, AffiliateCore, AffiliateCurrencyLocalizer, AffiliateDeepLink) {
    'use strict';

    class UiRenderer {
        constructor() {
            this.config = AffiliateConfig;
            this.core = AffiliateCore;
            this.localizer = AffiliateCurrencyLocalizer;
            this.deepLink = AffiliateDeepLink;
        }

        /**
         * Initialize module lifecycle
         */
        async init(config, core) {
            this.config = config || this.config;
            this.core = core || this.core;
            this.core.log('UI_RENDERER', 'UI Renderer module loaded successfully.');

            // Re-render UI when state or currency changes
            this.core.on('state:updated', (data) => {
                if (data.newState.activeCurrency !== data.prevState.activeCurrency) {
                    this.refreshRenderedPrices();
                }
            });
        }

        /**
         * Render individual deal card HTML string
         * @param {Object} deal - Deal item object
         */
        renderDealCard(deal) {
            const saleFormatted = this.localizer.convertPrice(deal.salePrice, deal.currency || 'INR');
            const origFormatted = deal.originalPrice ? this.localizer.convertPrice(deal.originalPrice, deal.currency || 'INR') : null;

            return `
                <div class="affiliate-deal-card" data-deal-id="${deal.id}">
                    ${deal.badge ? `<span class="affiliate-badge">${deal.badge}</span>` : ''}
                    <div class="affiliate-card-image-wrap">
                        <img src="${deal.imageUrl}" alt="${deal.title}" class="affiliate-card-image" loading="lazy" />
                    </div>
                    <h3 class="affiliate-card-title" title="${deal.title}">${deal.title}</h3>
                    <div class="affiliate-price-block">
                        <span class="affiliate-sale-price">${saleFormatted.formatted}</span>
                        ${origFormatted ? `<span class="affiliate-original-price">${origFormatted.formatted}</span>` : ''}
                        ${deal.discount ? `<span class="affiliate-discount-percent">${deal.discount}</span>` : ''}
                    </div>
                    <button type="button" class="affiliate-buy-btn" data-url="${deal.affiliateUrl}" data-store="${deal.store}">
                        Grab Deal on ${deal.store || 'Store'}
                    </button>
                </div>
            `;
        }

        /**
         * Render grid of deals inside target DOM container
         * @param {string} containerSelector - CSS selector for container
         * @param {Array} dealsArray - Array of deal objects
         */
        renderDealsGrid(containerSelector, dealsArray) {
            const container = document.querySelector(containerSelector);
            if (!container) {
                console.warn(`[AffiliateUiRenderer] Container ${containerSelector} not found.`);
                return;
            }

            const deals = dealsArray || this.core.getState().activeDeals || [];
            
            if (deals.length === 0) {
                container.innerHTML = `<p class="affiliate-empty-msg">No active deals found for your region.</p>`;
                return;
            }

            const gridHtml = `
                <div class="affiliate-deals-container">
                    <div class="affiliate-deals-grid">
                        ${deals.map(deal => this.renderDealCard(deal)).join('')}
                    </div>
                </div>
            `;

            container.innerHTML = gridHtml;
            this.bindCardEventListeners(container);
            this.core.log('UI_RENDERER', `Rendered ${deals.length} deal cards into ${containerSelector}`);
        }

        /**
         * Bind click handlers to rendered deal action buttons
         * @param {HTMLElement} containerElement 
         */
        bindCardEventListeners(containerElement) {
            const buttons = containerElement.querySelectorAll('.affiliate-buy-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const url = e.currentTarget.getAttribute('data-url');
                    const store = e.currentTarget.getAttribute('data-store');
                    if (this.deepLink && typeof this.deepLink.redirectToTarget === 'function') {
                        this.deepLink.redirectToTarget(url, store);
                    } else {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }
                });
            });
        }

        /**
         * Refresh prices on UI when currency gets switched
         */
        refreshRenderedPrices() {
            const activeDeals = this.core.getState().activeDeals;
            if (activeDeals && activeDeals.length > 0) {
                const container = document.querySelector('.affiliate-deals-grid');
                if (container && container.parentElement) {
                    this.renderDealsGrid('.' + container.parentElement.className.split(' ')[0], activeDeals);
                }
            }
        }
    }

    const instance = new UiRenderer();

    // Auto-register with Master Assembly if present
    if (typeof window !== 'undefined' && window.AffiliateAssembly) {
        window.AffiliateAssembly.registerModule('uiRenderer', instance);
    }

    return instance;
}));
