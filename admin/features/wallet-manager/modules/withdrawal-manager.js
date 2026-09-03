export function handleWithdrawalRequest(core, ui, email, amount, method) {
    const success = core.processWithdrawal(email, amount, method);
    if (success) {
        alert('Withdrawal request submitted successfully and logged to Google Sheets!');
        ui.render();
    } else {
        alert('Withdrawal failed: Insufficient wallet balance.');
    }
}
