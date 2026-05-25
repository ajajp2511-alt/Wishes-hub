async function startApp() {
    console.log("Wishes Hub: Starting...");
    const grid = document.getElementById('wishes-grid');
    
    // Loading indicator dikhao
    if(grid) grid.innerHTML = "<p style='color:white; padding:20px;'>Loading Wishes...</p>";

    try {
        // Firebase initialization check
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
            console.log("Firebase initializing...");
        }

        // Baki functions call karein
        if (typeof initStorage === 'function') await initStorage();
        if (typeof loadCategories === 'function') await loadCategories();
        
        console.log("Wishes Hub: Ready!");
    } catch (error) {
        console.error("Boot Error:", error);
        if(grid) grid.innerHTML = `<p style='color:red;'>Error: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', startApp);
