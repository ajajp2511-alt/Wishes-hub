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
