export class GlobalLanguageUI {
    constructor(core, handlers) {
        this.core = core;
        this.handlers = handlers;
        this.missingOnlyFilter = false;
        this.filterLangCode = 'hi';
    }

    init(container) {
        if (container) {
            container.innerHTML = `
                <div class="lang-wrapper space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
                        <div>
                            <h2 class="text-xl font-bold text-gray-800">Global Language & Translations</h2>
                            <p class="text-sm text-gray-500">Manage site languages, active view states, and dynamic translation keys.</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="window.openLanguageModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
                                <i class="fa-solid fa-plus"></i> Add Language
                            </button>
                            <button onclick="window.exportTranslations()" class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition" title="Export JSON">
                                <i class="fa-solid fa-download"></i>
                            </button>
                            <label class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition cursor-pointer" title="Import JSON">
                                <i class="fa-solid fa-upload"></i>
                                <input type="file" accept=".json" onchange="window.triggerImportTranslations(event)" class="hidden">
                            </label>
                        </div>
                    </div>

                    <!-- Languages List Section -->
                    <div class="space-y-3">
                        <h3 class="text-md font-semibold text-gray-700">Supported Languages</h3>
                        <div id="languageListContainer" class="space-y-3"></div>
                    </div>

                    <!-- Translations Matrix Section -->
                    <div class="bg-white border rounded-xl shadow-sm overflow-hidden mt-8">
                        <div class="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 class="text-md font-semibold text-gray-700">Translation Matrix</h3>
                            <span class="text-xs text-gray-500 font-mono">Live Key-Value Mapping</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase">
                                        <th class="py-3 px-4">Key / Group</th>
                                        <th class="py-3 px-3">English (en)</th>
                                        <th class="py-3 px-3">Hindi (hi)</th>
                                    </tr>
                                </thead>
                                <tbody id="translationTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Add Language Modal -->
                <div id="languageModal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4">
                    <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
                        <div class="flex justify-between items-center border-b pb-3">
                            <h3 class="font-bold text-gray-800 text-lg">Add New Language</h3>
                            <button onclick="window.closeLanguageModal()" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark text-lg"></i></button>
                        </div>
                        <form id="languageForm" class="space-y-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1">Language Name</label>
                                <input type="text" name="name" required placeholder="e.g. Spanish" class="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1">Native Name</label>
                                <input type="text" name="nativeName" required placeholder="e.g. Español" class="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Language Code</label>
                                    <input type="text" name="code" required placeholder="e.g. es" class="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500 font-mono">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1">Flag Emoji</label>
                                    <input type="text" name="flag" required placeholder="🇪🇸" class="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500">
                                </div>
                            </div>
                            <div class="flex justify-end gap-3 pt-2">
                                <button type="button" onclick="window.closeLanguageModal()" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" class="px-4 py-2 text-sm bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-sm">Save Language</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        }

        this.render();
        this.bindEvents();
    }

    render() {
        this.renderLanguageList();
        this.renderTranslationMatrix();
    }

    renderLanguageList() {
        const container = document.getElementById('languageListContainer');
        if (!container) return;
        
        container.innerHTML = '';
        const langs = this.core.getLanguages();

        langs.forEach(lang => {
            const progress = this.core.getTranslationProgress(lang.code);
            const isActive = lang.status === 'Active';
            const isCurrentActive = this.core.currentActiveLang === lang.code;
            
            const activeViewBadge = isCurrentActive 
                ? '<span class="bg-blue-100 text-blue-800 px-2.5 py-1 rounded text-xs font-semibold">Active View</span>'
                : (isActive ? `<button onclick="window.switchLang('${lang.code}')" class="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded hover:bg-indigo-100 transition">Switch to View</button>` : '');

            const statusToggleHtml = `
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" ${isActive ? 'checked' : ''} ${lang.isDefault ? 'disabled' : ''} onchange="window.toggleLangStatus('${lang.code}')" class="sr-only peer">
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                    <span class="ml-2 text-xs font-medium text-gray-700">${lang.status}</span>
                </label>
            `;

            const defaultBadge = lang.isDefault
                ? '<span class="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded text-xs font-semibold">Default</span>'
                : `<button onclick="window.setDefaultLang('${lang.code}')" class="text-xs text-gray-500 hover:underline">Set Default</button>`;

            const deleteButton = !lang.isDefault
                ? `<button onclick="window.deleteLang('${lang.code}')" class="text-red-400 hover:text-red-600 text-sm ml-2" title="Delete Language"><i class="fa-solid fa-trash"></i></button>`
                : '';

            container.innerHTML += `
                <div class="bg-white border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-4 transition hover:shadow">
                    <div class="flex items-center space-x-4">
                        <span class="text-3xl">${lang.flag}</span>
                        <div>
                            <h4 class="font-bold text-gray-800">${lang.name} <span class="text-gray-400 font-normal">(${lang.nativeName})</span></h4>
                            <p class="text-xs text-gray-500 font-mono">Code: ${lang.code} | Dir: ${lang.direction.toUpperCase()}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                        <div class="w-24">
                            <div class="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span id="progress-${lang.code}">${progress}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-1.5">
                                <div id="progress-bar-${lang.code}" class="bg-indigo-600 h-1.5 rounded-full" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        ${activeViewBadge}
                        ${statusToggleHtml}
                        ${defaultBadge}
                        ${deleteButton}
                    </div>
                </div>
            `;
        });
    }

    renderTranslationMatrix() {
        const tbody = document.getElementById('translationTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const translations = this.core.translations;
        const langs = this.core.getLanguages();

        for (const group in translations) {
            let groupRowsHtml = '';
            let hasVisibleRows = false;

            for (const key in translations[group]) {
                if (this.missingOnlyFilter) {
                    const targetVal = translations[group][key][this.filterLangCode] || '';
                    if (targetVal.trim() !== '') continue;
                }

                hasVisibleRows = true;
                let rowHtml = `<tr class="border-b hover:bg-gray-50"><td class="py-3 px-4 font-mono text-xs text-gray-600">${key}</td>`;
                
                langs.forEach(lang => {
                    const val = translations[group][key][lang.code] || '';
                    const isMissing = !val.trim();
                    const missingClass = isMissing ? 'border-red-300 bg-red-50' : 'border-gray-200';
                    
                    rowHtml += `
                        <td class="py-2 px-3">
                            <input type="text" 
                                value="${val}" 
                                placeholder="Missing (${lang.code})"
                                class="w-full text-xs px-2 py-1.5 border rounded ${missingClass} focus:outline-none focus:border-indigo-500"
                                oninput="window.updateTrans('${group}', '${key}', '${lang.code}', this.value)"
                            />
                        </td>
                    `;
                });

                rowHtml += `</tr>`;
                groupRowsHtml += rowHtml;
            }

            if (hasVisibleRows) {
                tbody.innerHTML += `<tr class="bg-slate-100"><td colspan="${langs.length + 1}" class="py-2 px-4 font-bold text-slate-700 text-sm uppercase tracking-wider">${group}</td></tr>`;
                tbody.innerHTML += groupRowsHtml;
            }
        }
    }

    updateProgressBar(langCode) {
        const progress = this.core.getTranslationProgress(langCode);
        const textElem = document.getElementById(`progress-${langCode}`);
        const barElem = document.getElementById(`progress-bar-${langCode}`);
        if (textElem) textElem.innerText = `${progress}%`;
        if (barElem) barElem.style.width = `${progress}%`;
    }

    openModal() {
        const modal = document.getElementById('languageModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    closeModal() {
        const modal = document.getElementById('languageModal');
        const form = document.getElementById('languageForm');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
        if (form) {
            form.reset();
        }
    }

    bindEvents() {
        const form = document.getElementById('languageForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handlers.onAdd(e));
        }
    }
}
