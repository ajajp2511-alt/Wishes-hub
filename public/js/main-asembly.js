// The "Glue" that binds all modules
async function startApp() {
    try {
        await initStorage();    // 1. Data load karo
        await loadCategories(); // 2. Categories load karo
        initSearch();           // 3. Search active karo
        console.log("Wishes Hub: All Systems Nominal");
    } catch (error) {
        console.error("Assembly Error:", error);
    }
}

document.addEventListener('DOMContentLoaded', startApp);
