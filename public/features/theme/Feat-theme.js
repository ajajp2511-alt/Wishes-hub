// Feature: Dark/Light Mode Switcher
window.toggleTheme = () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('userTheme', newTheme);
};

// Check saved theme on load
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('userTheme') || 'dark';
    document.body.setAttribute('data-theme', saved);
});
