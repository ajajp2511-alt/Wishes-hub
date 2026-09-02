export function handleSearchAndFilter(core, ui) {
    const query = document.getElementById('searchCategory').value.toLowerCase();
    const allOfTab = core.getCategoriesByType(core.activeTab);
    const filtered = allOfTab.filter(c => c.name.toLowerCase().includes(query));
    ui.renderTableRows(filtered);
}
