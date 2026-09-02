export class CategoryUI {
    constructor(core, handlers) {
        this.core = core;
        this.handlers = handlers;
    }

    init() {
        this.render(this.core.activeTab);
        this.bindEvents();
    }

    render(type) {
        this.core.activeTab = type;
        this.updateTabsUI(type);
        const data = this.core.getCategoriesByType(type);
        this.renderTableRows(data);
    }

    updateTabsUI(type) {
        const wishTab = document.getElementById('main-tab-wishes');
        const shayariTab = document.getElementById('main-tab-shayari');
        const sectionInfo = document.getElementById('sectionInfo');

        if (type === 'Wishes') {
            wishTab.className = "pb-3 font-semibold text-indigo-600 border-b-2 border-indigo-600 transition flex items-center";
            shayariTab.className = "pb-3 font-semibold text-gray-500 border-b-2 border-transparent hover:text-gray-700 transition flex items-center";
            sectionInfo.innerText = "Showing all categories under Wishes";
        } else {
            shayariTab.className = "pb-3 font-semibold text-indigo-600 border-b-2 border-indigo-600 transition flex items-center";
            wishTab.className = "pb-3 font-semibold text-gray-500 border-b-2 border-transparent hover:text-gray-700 transition flex items-center";
            sectionInfo.innerText = "Showing all categories under Shayari";
        }
    }

    renderTableRows(data) {
        const tbody = document.getElementById('categoryTableBody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="py-6 px-6 text-center text-gray-400">No categories found.</td></tr>`;
            return;
        }

        data.forEach(cat => {
            const statusBadge = cat.status === 'Active' 
                ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium cursor-pointer">Active</span>'
                : '<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium cursor-pointer">Inactive</span>';

            tbody.innerHTML += `
                <tr class="hover:bg-gray-50 transition">
                    <td class="py-3 px-6 text-xl">${cat.icon}</td>
                    <td class="py-3 px-6 font-medium text-gray-800">${cat.name}</td>
                    <td class="py-3 px-6 text-gray-500 font-mono text-xs">${cat.slug}</td>
                    <td class="py-3 px-6"><span class="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs">${cat.count} items</span></td>
                    <td class="py-3 px-6" onclick="window.toggleCatStatus(${cat.id})" title="Click to toggle status">${statusBadge}</td>
                    <td class="py-3 px-6 text-right space-x-2">
                        <button onclick="window.deleteCat(${cat.id})" class="text-red-500 hover:text-red-700 transition" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    openModal() {
        document.getElementById('modalCatType').value = this.core.activeTab;
        document.getElementById('categoryModal').classList.remove('hidden');
        document.getElementById('categoryModal').classList.add('flex');
    }

    closeModal() {
        document.getElementById('categoryModal').classList.add('hidden');
        document.getElementById('categoryModal').classList.remove('flex');
        document.getElementById('categoryForm').reset();
    }

    bindEvents() {
        document.getElementById('categoryForm').addEventListener('submit', (e) => this.handlers.onAdd(e));
        document.getElementById('searchCategory').addEventListener('input', () => this.handlers.onSearch());
    }
}
