import CategoriesCore from './categories-core.js';

export default async function initCategories() {
    console.log("Categories: Initializing...");
    try {
        // await zaroori hai taaki Assembly ko pata chale kab kaam khatam hua
        await CategoriesCore.loadCategories();
        console.log("Categories: Loaded successfully.");
    } catch (err) {
        console.error("Categories: Failed to load", err);
    }
}
