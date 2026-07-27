// Saved Core Logic

const SavedManager = {
    getSavedItems() {
        return JSON.parse(localStorage.getItem('savedWishes')) || [];
    },

    saveItem(itemText) {
        let savedItems = this.getSavedItems();
        if (!savedItems.includes(itemText)) {
            savedItems.push(itemText);
            localStorage.setItem('savedWishes', JSON.stringify(savedItems));
            return { success: true, message: "Wish successfully saved!" };
        }
        return { success: false, message: "This wish is already in your saved list." };
    },

    removeItem(index) {
        let savedItems = this.getSavedItems();
        savedItems.splice(index, 1);
        localStorage.setItem('savedWishes', JSON.stringify(savedItems));
        return this.getSavedItems();
    }
};

window.SavedManager = SavedManager;
