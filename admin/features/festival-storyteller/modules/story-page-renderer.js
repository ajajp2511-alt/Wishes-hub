/**
 * story-page-renderer.js
 * Comprehensive Frontend UI & Layout HTML Component Generator
 * Location: wishes-hub/admin/features/festival-storyteller/modules/story-page-renderer.js
 */

class StoryPageRenderer {
  constructor() {
    this.name = "StoryPageRenderer";
  }

  /**
   * Render complete HTML document layout for festival story page
   * @param {Object} compiledStory - Fully aggregated story payload from index engine
   * @returns {string} Full HTML content
   */
  renderFullPage(compiledStory) {
    if (!compiledStory) {
      return this.renderNotFoundPage();
    }

    const {
      metadata,
      content,
      rituals,
      culinaryAttire,
      literatureAudio,
      astronomyDestinations,
      cultureMap,
      socialCards,
      virtualRitual,
      monetization,
      affiliate,
      businessLeads
    } = compiledStory;

    return `
<!DOCTYPE html>
<html lang="${metadata.language || "hi"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.title} - Origin, History, Rituals & Celebration | Wishes Hub</title>
  <meta name="description" content="${content.summary || ""}">
  <link rel="stylesheet" href="/assets/css/festival-storyteller.css">
</head>
<body class="wh-festival-story-theme">

  <!-- Header Banner Ad -->
  ${this._renderAdSlot(monetization, "top-header-banner")}

  <!-- Hero Section -->
  <header class="wh-story-hero">
    <div class="wh-container">
      <span class="wh-badge">${content.category.toUpperCase()}</span>
      <h1 class="wh-hero-title">${content.title}</h1>
      <p class="wh-hero-summary">${content.summary}</p>
      
      <div class="wh-hero-meta">
        <span>📍 Origin: ${content.originCountry}</span>
        <span>⏳ Era: ${content.era}</span>
      </div>
    </div>
  </header>

  <main class="wh-container wh-story-grid">
    <div class="wh-main-content">

      <!-- History & Katha Section -->
      <section class="wh-card" id="history">
        <h2>📜 History & Sacred Katha</h2>
        <p class="wh-katha-text">${content.historyDetails.katha}</p>
        
        <div class="wh-mythology-box">
          <h3>✨ Symbolism & Significance</h3>
          <p>${content.historyDetails.symbolism}</p>
        </div>

        <!-- Kids Mode Box -->
        <div class="wh-kids-card">
          <h3>🎈 Kids Mode: ${content.kidsMode.title}</h3>
          <p>${content.kidsMode.simpleStory}</p>
          <strong>Moral: ${content.kidsMode.moralValue}</strong>
        </div>
      </section>

      <!-- Mid Inline Ad -->
      ${this._renderAdSlot(monetization, "mid-story-inline")}

      <!-- Step-by-Step Rituals Section -->
      <section class="wh-card" id="rituals">
        <h2>🪔 Rituals & Traditional Customs</h2>
        <div class="wh-ritual-steps">
          ${(rituals.stepByStepGuide || []).map(step => `
            <div class="wh-step-item">
              <span class="wh-step-num">${step.stepNumber}</span>
              <div>
                <h4>${step.action}</h4>
                <p>${step.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Virtual Ritual Engine -->
      <section class="wh-card wh-virtual-puja-box" id="virtual-ritual">
        <h2>${virtualRitual.title || "Virtual Puja Experience"}</h2>
        <p>${virtualRitual.description || ""}</p>
        
        <div class="wh-ritual-buttons">
          ${(virtualRitual.interactiveActions || []).map(act => `
            <button class="wh-btn-ritual" onclick="triggerVirtualAction('${act.id}')">
              <span class="wh-icon">${act.icon}</span>
              <span>${act.label}</span>
            </button>
          `).join('')}
        </div>
      </section>

      <!-- Culinary & Attire Section -->
      <section class="wh-card" id="culinary-attire">
        <h2>🍲 Festive Delicacies & Ethnic Attire</h2>
        <div class="wh-two-col">
          <div>
            <h3>Special Sweets & Foods</h3>
            <ul>
              ${(culinaryAttire.culinary?.specialDishes || []).map(dish => `<li>${dish}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h3>Recommended Attire</h3>
            <ul>
              ${(culinaryAttire.attire?.dressCode || []).map(wear => `<li>${wear}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- Affiliate Store Section -->
      ${this._renderAffiliateStore(affiliate)}

      <!-- Business Leads Section -->
      ${this._renderBusinessLeads(businessLeads)}

    </div>

    <!-- Sidebar Right -->
    <aside class="wh-sidebar">
      
      <!-- Countdown & Global Map Marker -->
      <div class="wh-card wh-widget">
        <h3>⏳ Countdown Clock</h3>
        <p>${cultureMap.countdownTimer?.label || "Festival Celebration"}</p>
        <div class="wh-timer-display" id="festival-timer">-- Days -- Hours</div>
      </div>

      <!-- Literature & Audio Player -->
      <div class="wh-card wh-widget">
        <h3>🎧 Audio Katha & Chants</h3>
        <p><strong>${literatureAudio.audioNarration?.trackTitle || "Listen Katha"}</strong></p>
        <audio controls src="${literatureAudio.audioNarration?.audioUrl || "#"}"></audio>
      </div>

      <!-- Social Cards Generator -->
      <div class="wh-card wh-widget">
        <h3>📲 Share Status Cards</h3>
        ${(socialCards.cardTemplates || []).map(card => `
          <div class="wh-social-template">
            <p>${card.headline}</p>
            <a href="${card.downloadUrl}" class="wh-btn-download">Download Image</a>
          </div>
        `).join('')}
      </div>

      <!-- Sidebar Sponsor Ad -->
      ${this._renderAdSlot(monetization, "sidebar-sponsorship")}

    </aside>
  </main>

  <!-- Sticky Footer Ad -->
  ${this._renderAdSlot(monetization, "bottom-footer-banner")}

  <script src="/assets/js/festival-storyteller.js"></script>
</body>
</html>
    `;
  }

  _renderAdSlot(monetization, placementId) {
    if (!monetization || !monetization.enabled) return "";
    return `<div class="wh-ad-slot-wrapper" data-slot="${placementId}"></div>`;
  }

  _renderAffiliateStore(affiliate) {
    if (!affiliate || !affiliate.enabled) return "";
    return `
      <section class="wh-card wh-affiliate-box">
        <h2>🛍️ ${affiliate.storeTitle}</h2>
        <div class="wh-product-grid">
          ${(affiliate.products || []).map(prod => `
            <div class="wh-product-card">
              <span class="wh-tag">${prod.badge}</span>
              <h4>${prod.title}</h4>
              <p class="wh-price">${prod.price}</p>
              <a href="${prod.buyUrl}" target="_blank" class="wh-btn-buy">Buy Now</a>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  _renderBusinessLeads(businessLeads) {
    if (!businessLeads || !businessLeads.enabled) return "";
    return `
      <section class="wh-card wh-leads-box">
        <h2>🤝 ${businessLeads.title}</h2>
        <p>${businessLeads.subtitle}</p>
        <div class="wh-service-list">
          ${(businessLeads.services || []).map(srv => `
            <div class="wh-service-item">
              <span>${srv.icon}</span>
              <div>
                <h4>${srv.serviceName}</h4>
                <p>${srv.description}</p>
              </div>
              <button class="wh-btn-lead" onclick="openLeadModal('${srv.id}')">${srv.ctaText}</button>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  renderNotFoundPage() {
    return `
      <div class="wh-not-found">
        <h1>404 - Festival Story Not Found</h1>
        <p>The requested festival story could not be found or is currently being prepared.</p>
        <a href="/">Return to Wishes Hub Home</a>
      </div>
    `;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = StoryPageRenderer;
}
