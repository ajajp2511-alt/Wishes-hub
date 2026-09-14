/**
 * manage-home-import-export.js
 * External script binding and global window exposure
 */
import { assembleHomeModule } from './manage-home-assembly.js';
import { HomeExport } from './modules/manage-home-export.js';

window.WishesHome = {
  init: assembleHomeModule,
  exportReport: HomeExport.downloadCSV
};
