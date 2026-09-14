/**
 * modules/manage-home-widgets.js
 * Drag-and-drop layout and localStorage save
 */
export const HomeWidgets = {
  init() {
    const grid = document.getElementById('wh-widgets-grid');
    if (grid) {
      grid.dataset.layout = 'active';
    }
  }
};
