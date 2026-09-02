export function handleAddLanguage(core, ui, event) {
    event.preventDefault();
    const code = document.getElementById('langCode').value.trim().toLowerCase();
    const name = document.getElementById('langName').value.trim();
    const nativeName = document.getElementById('langNative').value.trim();
    const flag = document.getElementById('langFlag').value.trim();
    const direction = document.getElementById('langDirection').value;
    const status = document.getElementById('langStatus').value;

    const success = core.addLanguage({ code, name, nativeName, flag, direction, status });
    if (success) {
        ui.closeModal();
        ui.render();
    } else {
        alert('Language code already exists!');
    }
}
