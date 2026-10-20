/**
 * story-admin-cms.js
 * Administrative Management Interface & Content Control System
 * Location: wishes-hub/admin/features/festival-storyteller/modules/story-admin-cms.js
 */

const FestivalStorytellerEngine = require('../festival-storyteller-engine');
const FestivalStoryConfig = require('../festival-story-config');

class StoryAdminCMS {
  constructor() {
    this.name = "StoryAdminCMS";
    this.engine = FestivalStorytellerEngine;
    this.config = FestivalStoryConfig;
  }

  /**
   * Fetch all registered festival stories for CMS listing
   * @returns {Array<Object>} List of festival summary metadata
   */
  getAllStories() {
    const rawList = this.engine.dataStorage.getAllFestivals();
    return rawList.map(item => ({
      slug: item.slug,
      title: item.title,
      category: item.category,
      originCountry: item.originCountry,
      status: item.status || "Published",
      viewsCount: item.viewsCount || 0
    }));
  }

  /**
   * Get single festival story for CMS editor form
   * @param {string} slug - Unique festival slug
   * @returns {Object|null} Full festival record
   */
  getStoryForEdit(slug) {
    return this.engine.dataStorage.getFestivalBySlug(slug);
  }

  /**
   * Create or update a festival story entry
   * @param {Object} festivalData - Festival content payload
   * @returns {Object} Operation response
   */
  saveStory(festivalData) {
    if (!festivalData || !festivalData.title) {
      return {
        success: false,
        message: "Festival title is required."
      };
    }

    const generatedSlug = festivalData.slug || this.engine.slugRouter.generateSlug(festivalData.title);
    
    const updatedRecord = {
      ...festivalData,
      slug: generatedSlug,
      updatedAt: new Date().toISOString()
    };

    const saved = this.engine.dataStorage.saveFestival(updatedRecord);

    return {
      success: true,
      slug: saved.slug,
      message: `Festival story '${saved.title}' saved successfully.`
    };
  }

  /**
   * Toggle feature flags in config dynamically from CMS
   * @param {string} featureName - Key in config.featuresEnabled
   * @param {boolean} status - True or False
   * @returns {Object} Updated feature status
   */
  toggleFeature(featureName, status) {
    if (this.config.featuresEnabled.hasOwnProperty(featureName)) {
      this.config.featuresEnabled[featureName] = Boolean(status);
      return {
        success: true,
        feature: featureName,
        enabled: this.config.featuresEnabled[featureName]
      };
    }

    return {
      success: false,
      message: `Feature '${featureName}' does not exist.`
    };
  }

  /**
   * Render complete HTML for CMS Dashboard Panel
   * @returns {string} CMS Dashboard HTML layout
   */
  renderCMSDashboard() {
    const stories = this.getAllStories();
    const features = this.config.featuresEnabled;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Festival Storyteller - Admin CMS Panel</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f4f6f9; color: #333; }
    .cms-container { max-width: 1200px; margin: 0 auto; background: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    h1, h2 { color: #1a202c; border-bottom: 2px solid #edf2f7; padding-bottom: 10px; }
    .cms-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #edf2f7; }
    th { background: #f8fafc; font-weight: 600; }
    .status-badge { background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; }
    .feature-toggle { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; }
    .btn { background: #3182ce; color: #fff; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; text-decoration: none; font-size: 0.9rem; }
    .btn:hover { background: #2b6cb0; }
  </style>
</head>
<body>
  <div class="cms-container">
    <h1>🚩 Festival Storyteller - Admin Control Panel</h1>
    
    <div class="cms-grid">
      <div>
        <h2>Published Festival Stories</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Origin</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${stories.map(s => `
              <tr>
                <td><strong>${s.title}</strong><br><small>/festival/${s.slug}</small></td>
                <td>${s.category}</td>
                <td>${s.originCountry}</td>
                <td><span class="status-badge">${s.status}</span></td>
                <td><a href="/admin/festival-storyteller/edit?slug=${s.slug}" class="btn">Edit</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Feature Toggles</h2>
        ${Object.keys(features).map(key => `
          <div class="feature-toggle">
            <span>${key}</span>
            <input type="checkbox" ${features[key] ? 'checked' : ''} onchange="toggleCMSFeature('${key}', this.checked)">
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <script>
    function toggleCMSFeature(feature, status) {
      fetch('/api/admin/festival-storyteller/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature, status })
      });
    }
  </script>
</body>
</html>
    `;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = StoryAdminCMS;
}
