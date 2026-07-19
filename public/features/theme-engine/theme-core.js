// Wishes-hub: Theme Core Logic
import { ThemeConfig } from './theme-config.js';

const ThemeCore = {
    currentTheme: localStorage.getItem('wishes-hub-theme') || ThemeConfig.defaultTheme,

    init() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    },

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('wishes-hub-theme', this.currentTheme);
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
};

export default ThemeCore;
