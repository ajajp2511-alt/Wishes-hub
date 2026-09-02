export function handleDeleteCategory(core, ui, id) {
    if (confirm('Are you sure you want to delete this category?')) {
        core.deleteCategory(id);
        ui.render(core.activeTab);
    }
}
