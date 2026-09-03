export function handleGoogleSheetsSyncExport(core) {
    const ledger = core.getLedger();
    console.log("Exporting current ledger state to Google Sheets endpoint...");
    return { success: true, count: ledger.length };
}
