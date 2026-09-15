export function handleManualAdjustment(core, ui, email, type, amount, reason) {
    const success = core.adminManualAdjustment(email, type, amount, reason);
    if (success) {
        alert(`Wallet successfully adjusted! (${type}: ₹${amount})`);
        ui.render();
    }
}
