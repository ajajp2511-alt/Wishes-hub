/**
 * modules/manage-home-palette.js
 * Ctrl+K command search popup
 */
export const HomePalette = {
  init() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.togglePalette();
      }
    });

    const trigger = document.getElementById('wh-palette-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => this.togglePalette());
    }
  },

  togglePalette() {
    let modal = document.getElementById('wh-command-palette');
    if (modal) {
      modal.remove();
      return;
    }

    modal = document.createElement('div');
    modal.id = 'wh-command-palette';
    modal.innerHTML = `
      <div class="wh-palette-backdrop" onclick="this.parentElement.remove()">
        <div class="wh-palette-box" onclick="event.stopPropagation()">
          <input type="text" placeholder="Type a command or search..." autofocus />
          <div class="wh-palette-results">
            <div>Go to Wishes Management</div>
            <div>Toggle Dark Mode</div>
            <div>Clear Cache</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
};
