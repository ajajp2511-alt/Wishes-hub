/**
 * Base Layout HTML Template
 */
const layoutTemplate = `
  <header class="app-header">
    <h1>Wishes Hub</h1>
    <button id="theme-toggle-btn" class="theme-btn">🌙 Theme</button>
  </header>

  <main class="main-container">
    <div class="input-group">
      <input type="text" id="user-name-input" placeholder="Apna Naam Likhein...">
    </div>

    <div class="search-group">
      <input type="text" id="search-input" placeholder="Wishes khojein...">
      <button id="clear-search-btn" class="clear-btn">✕</button>
    </div>

    <div class="filter-tags">
      <button class="filter-btn active">All</button>
      <button class="filter-btn">Birthday</button>
      <button class="filter-btn">Anniversary</button>
    </div>

    <div id="wishes-list" class="wishes-container"></div>
  </main>
`;

/**
 * Base Layout Module Initialization
 */
export function initBaseLayout() {
  try {
    // Inject HTML layout directly into body synchronously
    document.body.innerHTML = layoutTemplate;
    console.log("🏛️ Base Layout Rendered Successfully!");
    return { status: "success", module: "base-layout" };
  } catch (error) {
    console.error("❌ Error rendering Base Layout:", error);
    return { status: "error", module: "base-layout" };
  }
}
