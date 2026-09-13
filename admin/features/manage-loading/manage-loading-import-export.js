/**
 * manage-loading-import-export.js
 * External script binding and global window exposure
 */
import { loader } from './manage-loading-core.js';
import { assembleLoadingModule } from './manage-loading-assembly.js';

assembleLoadingModule();
window.WishesLoader = loader;
