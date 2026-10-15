/**
 * CSV/Excel Bulk Coupon Importer & Inventory Loader
 * Path: admin/features/coupons/admin-bulk-csv-importer.js
 * Description: Parses raw CSV content, validates structured rows,
 *              and bulk-loads hundreds of custom voucher codes into inventory.
 */

import { couponsCore } from './coupons-core.js';
import { adminCouponCreator } from './admin-coupon-creator.js';

export class AdminBulkCSVImporterEngine {
  constructor() {
    this.core = couponsCore;
    this.creator = adminCouponCreator;
  }

  /**
   * Parse CSV String into Structured Array of Row Objects
   */
  parseCSV(csvText) {
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === headers.length) {
        const rowObj = {};
        headers.forEach((header, index) => {
          rowObj[header] = values[index];
        });
        records.push(rowObj);
      }
    }

    return records;
  }

  /**
   * Import Bulk Coupons from CSV Content
   * Expected CSV Headers: title, brandName, category, faceValueINR, sellingPriceINR, voucherCode, secretPin, expiryDate
   */
  processBulkCSVImport(csvText) {
    this.core.log('BULK_IMPORTER', 'Starting bulk CSV coupon import parsing...', 'INFO');
    
    const rows = this.parseCSV(csvText);
    if (rows.length === 0) {
      this.core.log('BULK_IMPORTER', 'CSV import failed: File is empty or headers are invalid.', 'ERROR');
      return { success: false, importedCount: 0, failedCount: 0, error: 'Empty or invalid CSV headers.' };
    }

    let importedCount = 0;
    let failedCount = 0;
    const errors = [];

    rows.forEach((row, index) => {
      const result = this.creator.createCustomCoupon({
        title: row.title || row.brandName + ' Voucher',
        brandName: row.brandName,
        category: row.category || 'General',
        faceValueINR: row.faceValueINR,
        sellingPriceINR: row.sellingPriceINR,
        voucherCode: row.voucherCode,
        secretPin: row.secretPin || '',
        stockCount: 1,
        expiryDate: row.expiryDate || null
      });

      if (result.success) {
        importedCount++;
      } else {
        failedCount++;
        errors.push({ rowNumber: index + 2, reason: result.error });
      }
    });

    this.core.log('BULK_IMPORTER', `CSV Import complete: ${importedCount} imported, ${failedCount} failed.`, importedCount > 0 ? 'SUCCESS' : 'WARN');
    
    return {
      success: importedCount > 0,
      totalProcessed: rows.length,
      importedCount,
      failedCount,
      errors
    };
  }
}

export const adminBulkCSVImporter = new AdminBulkCSVImporterEngine();
