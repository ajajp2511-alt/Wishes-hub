export function handleP2PTransfer(core, senderEmail, recipientEmail, amount) {
    const sender = core.wallets.find(w => w.email === senderEmail);
    const recipient = core.wallets.find(w => w.email === recipientEmail);

    if (!sender || !recipient || sender.balance < amount) return false;

    sender.balance -= Number(amount);
    recipient.balance += Number(amount);
    return true;
}
