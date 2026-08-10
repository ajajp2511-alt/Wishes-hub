// admin/features/google-sheets/sheets-assembly.js
import { 
  getMasterSheetValues, 
  getSubSheetValues, 
  appendSheetIdToMaster, 
  deleteSheetIdFromMaster 
} from './sheets-core.js';
import { renderDirectoryCards } from './components/sheet-directory.js';
import { renderDataTable } from './components/sheet-table.js';
import { setupToolbarControls } from './components/sheet-toolbar.js';
import { renderAddSheetModal } from './components/sheet-modal.js';

let activeMasterList = [];
let activeSheetHeaders = [];
let activeSheetRows = [];

// 1. Master Directory Data Fetch & Processing
export async function loadMasterDirectoryData() {
  const rawRows = await getMasterSheetValues();

  const directoryPromises = rawRows.map(async (row, index) => {
    const sheetName = row[0] || 'Untitled Sheet';
    const sheetId = row[1] || '';
    
    let totalRows = 0;
    if (sheetId) {
      const subData = await getSubSheetValues(sheetId);
      totalRows = subData.length > 0 ? subData.length - 1 : 0;
    }

    return {
      id: index + 1,
      sheetName,
      sheetId,
      totalRows
    };
  });

  activeMasterList = await Promise.all(directoryPromises);
  return activeMasterList;
}

// 2. Single Sheet Content Fetch
export async function loadSingleSheetContent(sheetId) {
  if (!sheetId) return { headers: [], rows: [] };
  const rawData = await getSubSheetValues(sheetId);
  if (rawData.length === 0) return { headers: [], rows: [] };

  activeSheetHeaders = rawData[0] || [];
  activeSheetRows = rawData.slice(1) || [];

  return {
    headers: activeSheetHeaders,
    rows: activeSheetRows
  };
}

// 3. Admin Panel Actions (Add & Delete)
export async function addNewSheetId(sheetName, sheetId, accessToken) {
  if (!sheetName || !sheetId) {
    throw new Error('Sheet Name aur Sheet ID dono zaruri hain.');
  }

  return await appendSheetIdToMaster(sheetName, sheetId, accessToken);
}

export async function removeSheetId(rowIndex, accessToken) {
  if (!rowIndex) {
    throw new Error('Row Index zaruri hai.');
  }

  return await deleteSheetIdFromMaster(rowIndex, accessToken);
}

// 4. UI Component Mounting Bridges
export function mountDirectoryComponent(container, onSelectCallback, onDeleteCallback) {
  renderDirectoryCards(container, activeMasterList, onSelectCallback, onDeleteCallback);
}

export function mountTableComponent(container, headers = activeSheetHeaders, rows = activeSheetRows) {
  renderDataTable(container, headers, rows);
}

export function mountToolbarComponent(dropdownEl, searchEl, onSelectCallback) {
  setupToolbarControls({
    dropdown: dropdownEl,
    searchInput: searchEl,
    masterDataList: activeMasterList,
    onSheetSelect: onSelectCallback,
    onSearch: (query) => {
      const filteredRows = activeSheetRows.filter(row => 
        row.some(cell => String(cell).toLowerCase().includes(query))
      );
      renderDataTable(document.getElementById('table-wrapper'), activeSheetHeaders, filteredRows);
    }
  });
}

// 5. Entry point for FeaturesAssembly Loader
export async function initGoogleSheets() {
  const root = document.getElementById('dynamic-content-root');
  if (!root) return;

  root.innerHTML = `
    <div class="sheets-wrapper">
      <div class="top-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Master Sheet Dashboard</h2>
        <div class="action-tools" style="display: flex; gap: 10px;">
          <button id="add-sheet-btn" class="btn-refresh" style="background-color: #10b981; color: white; border: none; padding: 8px 14px; border-radius: 4px; cursor: pointer;">+ Add Sheet</button>
          <select id="sheet-dropdown" class="dropdown-select" style="display: none;"></select>
          <input type="text" id="search-input" class="search-input" placeholder="Search data..." style="display: none;" />
          <button id="refresh-btn" class="btn-refresh">Sync Data 🔄</button>
        </div>
      </div>

      <div id="directory-container">
        <h3>All Google Sheets</h3>
        <div id="directory-grid" class="directory-grid"></div>
      </div>

      <div id="sheet-view-container" style="display: none; margin-top: 20px;">
        <h3 id="active-sheet-title">Sheet View</h3>
        <div id="table-wrapper"></div>
      </div>
    </div>

    <div id="modal-container"></div>
  `;

  const directoryGrid = document.getElementById('directory-grid');
  const sheetDropdown = document.getElementById('sheet-dropdown');
  const searchInput = document.getElementById('search-input');
  const refreshBtn = document.getElementById('refresh-btn');
  const addSheetBtn = document.getElementById('add-sheet-btn');
  const modalContainer = document.getElementById('modal-container');
  const sheetViewContainer = document.getElementById('sheet-view-container');
  const activeSheetTitle = document.getElementById('active-sheet-title');
  const tableWrapper = document.getElementById('table-wrapper');

  const userAccessToken = window.ENV_ACCESS_TOKEN || '';

  async function refreshUI() {
    directoryGrid.innerHTML = '<p>Master Sheet Sync ho rahi hai...</p>';
    await loadMasterDirectoryData();

    mountDirectoryComponent(directoryGrid, handleSelect, handleDelete);
    mountToolbarComponent(sheetDropdown, searchInput, handleSelect);
  }

  async function handleSelect(sheetId, sheetName) {
    if (!sheetId) return;
    sheetDropdown.value = sheetId;
    searchInput.style.display = 'inline-block';
    searchInput.value = '';
    sheetViewContainer.style.display = 'block';
    activeSheetTitle.innerText = `Loading: ${sheetName}...`;
    tableWrapper.innerHTML = '<p>Data fetch ho raha hai...</p>';

    const { headers, rows } = await loadSingleSheetContent(sheetId);
    activeSheetTitle.innerText = `Data View: ${sheetName}`;
    mountTableComponent(tableWrapper, headers, rows);
  }

  async function handleDelete(rowIndex) {
    try {
      await removeSheetId(rowIndex, userAccessToken);
      alert('Sheet remove ho gayi!');
      await refreshUI();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }

  addSheetBtn.addEventListener('click', () => {
    renderAddSheetModal(modalContainer, async (name, id) => {
      try {
        await addNewSheetId(name, id, userAccessToken);
        alert('Sheet successfully add ho gayi!');
        modalContainer.innerHTML = '';
        await refreshUI();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }, () => {
      modalContainer.innerHTML = '';
    });
  });

  refreshBtn.addEventListener('click', refreshUI);

  await refreshUI();
    }
