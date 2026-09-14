/**
 * modules/manage-home-notes.js
 * Admin sticky scratchpad with auto-save
 */
import { HomeConfig } from '../manage-home-config.js';

export const HomeNotes = {
  init() {
    const grid = document.getElementById('wh-widgets-grid');
    if (!grid) return;

    const savedNote = localStorage.getItem(HomeConfig.storageKeys.scratchpad) || '';

    const notesBox = document.createElement('div');
    notesBox.id = 'wh-notes-widget';
    notesBox.className = 'wh-widget-card';
    notesBox.innerHTML = `
      <h3>Admin Scratchpad</h3>
      <textarea id="wh-scratchpad-input" placeholder="Type quick notes here...">${savedNote}</textarea>
    `;
    grid.appendChild(notesBox);

    const textarea = notesBox.querySelector('textarea');
    textarea.addEventListener('input', (e) => {
      localStorage.setItem(HomeConfig.storageKeys.scratchpad, e.target.value);
    });
  }
};
