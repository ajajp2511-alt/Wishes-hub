import StorageCore from '../storage-manager/storage-core.js';
import { ThemeConfig } from './theme-config.js';

const ThemeCore = {
    // Ab ye StorageCore ka use karega
    currentTheme: StorageCore.get('theme') || ThemeConfig.defaultTheme,

    init() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    },

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        StorageCore.set('theme', this.currentTheme); // Data save ho gaya
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
};

export default ThemeCore;
