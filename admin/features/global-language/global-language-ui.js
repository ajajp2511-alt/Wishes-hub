export class GlobalLanguageUI {
    constructor(core, handlers) {
        this.core = core;
        this.handlers = handlers;
        this.missingOnlyFilter = false;
        this.filterLangCode = 'hi';
    }

    init() {
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
        document.getElementById('languageModal').classList.remove('hidden');
        document.getElementById('languageModal').classList.add('flex');
    }

    closeModal() {
        document.getElementById('languageModal').classList.add('hidden');
        document.getElementById('languageModal').classList.remove('flex');
        document.getElementById('languageForm').reset();
    }

    bindEvents() {
        const form = document.getElementById('languageForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handlers.onAdd(e));
        }
    }
  }
