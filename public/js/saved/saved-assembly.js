// Saved Assembly Logic - UI Renderer

document.addEventListener("DOMContentLoaded", () => {
    renderSavedList();
});

function renderSavedList() {
    const container = document.getElementById('saved-items-container');
    if (!container) return;

    const savedItems = window.SavedManager ? window.SavedManager.getSavedItems() : [];

    if (savedItems.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #94a3b8; margin-top: 20px;">No saved wishes found!</p>`;
        return;
    }

    container.innerHTML = '';
    savedItems.forEach((item, index) => {
        container.innerHTML += `
            <div style="background: #1e293b; padding: 15px; margin-bottom: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; color: white;">
                <span>${item}</span>
                <button onclick="deleteSavedItem(${index})" style="background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Delete</button>
            </div>
        `;
    });
}

function deleteSavedItem(index) {
    if (window.SavedManager) {
        window.SavedManager.removeItem(index);
        renderSavedList();
    }
    }
