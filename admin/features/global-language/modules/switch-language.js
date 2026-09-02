export function handleSwitchLanguage(core, ui, langCode) {
    const success = core.switchActiveLanguage(langCode);
    if (!success) {
        alert('This language is inactive or unavailable.');
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const dataAttr = el.getAttribute('data-i18n');
        const [group, key] = dataAttr.split('.');
        const translatedText = core.getTranslation(group, key, langCode);
        
        if (translatedText) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translatedText;
            } else {
                el.innerText = translatedText;
            }
        }
    });

    const activeLangObj = core.getLanguages().find(l => l.code === langCode);
    if (activeLangObj) {
        document.documentElement.setAttribute('dir', activeLangObj.direction);
        document.documentElement.setAttribute('lang', langCode);
    }

    ui.render();
}
