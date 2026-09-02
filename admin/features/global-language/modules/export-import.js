export function handleExportJSON(core) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(core.exportTranslationsJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wishes-hub-translations-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

export function handleImportJSON(core, ui, event) {
    const fileReader = new FileReader();
    if (event.target.files[0]) {
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
            const success = core.importTranslationsJSON(e.target.result);
            if (success) {
                alert('Translations imported successfully!');
                ui.render();
            } else {
                alert('Failed to import! Ensure file is valid JSON.');
            }
        };
    }
}
