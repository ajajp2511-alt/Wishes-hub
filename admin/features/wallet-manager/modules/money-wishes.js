export function handleSendMoneyWish(core, ui, sender, recipient, amount, note, isAnon, isLocked, audio) {
    const res = core.sendMoneyWish(sender, recipient, amount, note, isAnon, isLocked, audio);
    if (res.success) {
        alert(`Money Wish successfully sent! Wish ID: ${res.wishId} (Net Gift: ₹${res.netAmount})`);
        ui.render();
    } else {
        alert(res.message);
    }
}
