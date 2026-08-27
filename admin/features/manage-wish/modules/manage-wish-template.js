/**
 * Manage Wish - Base Layout Template
 * Path: admin/features/manage-wish/modules/manage-wish-template.js
 */

import { TABLE_COLUMNS, FILTER_OPTIONS } from '../manage-wish-config.js';

export function getManageWishLayoutHTML() {
  return `
    <div class="manage-wish-container">
      <div class="wish-health-bar" id="health-status-bar">
        <span class="status-indicator">Checking Sheet Health...</span>
      </div>

      <div class="toolbar-section">
        <input type="text" id="search-wish-input" placeholder="Search by Wish ID or Title..." />
        
        <select id="filter-category-select">
          ${FILTER_OPTIONS.categories.map(c => `<option value="${c}">Category: ${c}</option>`).join('')}
        </select>

        <select id="filter-status-select">
          ${FILTER_OPTIONS.statuses.map(s => `<option value="${s}">Status: ${s}</option>`).join('')}
        </select>

        <div class="action-buttons">
          <button id="btn-bulk-delete" class="btn-danger">Bulk Delete</button>
          <button id="btn-export-csv" class="btn-secondary">Export CSV</button>
          <button id="btn-undo-action" class="btn-outline">↩ Undo</button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="manage-wish-table">
          <thead>
            <tr>
              <th><input type="checkbox" id="select-all-checkbox" /></th>
              ${TABLE_COLUMNS.filter(c => c.key !== 'select').map(c => `<th>${c.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody id="wish-table-body">
            <tr><td colspan="7">Loading wish data...</td></tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-bar" id="pagination-container"></div>
    </div>
  `;
}
