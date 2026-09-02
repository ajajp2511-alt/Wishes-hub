export function handleAddCategory(core, ui, event) {
    event.preventDefault();
    const name = document.getElementById('catName').value;
    const type = document.getElementById('modalCatType').value;
    const icon = document.getElementById('catIcon').value;
    const status = document.getElementById('catStatus').value;

    core.addCategory({ name, type, icon, status });
    ui.closeModal();
    ui.render(core.activeTab);
}
