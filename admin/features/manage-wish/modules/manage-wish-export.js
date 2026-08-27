/**
 * Manage Wish Feature - Bulk CSV Importer & Backup Generator
 * Path: admin/features/manage-wish/manage-wish-import-export.js
 */

export class ManageWishImportExport {
  constructor() {
    this.apiEndpoint = '/api/sheets';
  }

  /**
   * Export Wish Data to JSON or CSV File Download
   */
  exportData(wishesData, format = 'json', filename = 'wishes_backup') {
    if (!wishesData || wishesData.length === 0) {
      return { success: false, message: 'No data available to export.' };
    }

    let fileContent = '';
    let mimeType = 'text/plain';
    let fileExtension = format;

    if (format === 'json') {
      fileContent = JSON.stringify(wishesData, null, 2);
      mimeType = 'application/json';
    } else if (format === 'csv') {
      const headers = Object.keys(wishesData[0]).join(',');
      const rows = wishesData.map(row => 
        Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
      );
      fileContent = [headers, ...rows].join('\n');
      mimeType = 'text/csv';
    }

    // Trigger Browser File Download
    const blob = new Blob([fileContent], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${Date.now()}.${fileExtension}`;
    link.click();
    URL.revokeObjectURL(link.href);

    return { success: true, count: wishesData.length };
  }

  /**
   * Parse CSV File Content into Array of Objects
   */
  async parseCSVFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const lines = text.split('\n').filter(line => line.trim() !== '');
          if (lines.length < 2) throw new Error('CSV file is empty or missing headers.');

          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          const parsedData = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const entry = {};
            headers.forEach((header, index) => {
              entry[header] = values[index] || '';
            });
            return entry;
          });

          resolve({ success: true, data: parsedData });
        } catch (error) {
          reject({ success: false, message: error.message });
        }
      };
      reader.onerror = () => reject({ success: false, message: 'Error reading file.' });
      reader.readAsText(file);
    });
  }
}

export const manageWishImportExportInstance = new ManageWishImportExport();
