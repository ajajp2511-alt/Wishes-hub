// Feature: Category Management Engine
const CATEGORY_COLLECTION = "app_config";

async function updateCategories(newList) {
    await db.collection(CATEGORY_COLLECTION).doc("categories").set({
        list: newList
    });
    alert("Categories updated for all users!");
}

async function loadCategories() {
    const doc = await db.collection(CATEGORY_COLLECTION).doc("categories").get();
    if (doc.exists) {
        window.AppConfig.categories = doc.data().list;
        setupCategoryChips(window.AppConfig.categories); // User side refresh
    }
}
