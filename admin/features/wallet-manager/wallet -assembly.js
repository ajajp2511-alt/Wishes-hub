import { WalletCore } from './wallet-core.js';
import { WalletUI } from './wallet-ui.js';
import { handleWithdrawalRequest } from './modules/withdrawal-manager.js';
import { handleManualAdjustment } from './modules/manual-adjustment.js';
import { handleSendMoneyWish } from './modules/money-wishes.js';
import { spinAndWinReward } from './modules/gamified-bonus.js';

const core = new WalletCore();
const ui = new WalletUI(core);

// Expose global triggers for UI interactions
window.requestUserWithdrawal = (email) => {
    const amount = prompt('Enter withdrawal amount (INR):', '1000');
    if (amount) handleWithdrawalRequest(core, ui, email, Number(amount), 'Bank Transfer (UPI/IMPS)');
};

window.openManualModal = (email) => {
    const type = prompt('Adjustment Type (Credit or Debit):', 'Credit');
    const amount = prompt('Enter amount:', '500');
    const reason = prompt('Enter reason for adjustment:', 'Bonus Reward Adjustment');
    if (type && amount && reason) {
        handleManualAdjustment(core, ui, email, type, Number(amount), reason);
    }
};

window.triggerSendMoneyWishModal = () => {
    const sender = prompt('Sender Email:', 'aarav@example.com');
    const recipient = prompt('Recipient Email:', 'priya@example.com');
    const amount = prompt('Gift Amount (INR):', '500');
    const note = prompt('Wish Note / Message:', 'Happy Birthday!');
    const isAnon = confirm('Send anonymously?');
    const isLocked = confirm('Lock until scheduled time?');

    if (sender && recipient && amount) {
        handleSendMoneyWish(core, ui, sender, recipient, Number(amount), note, isAnon, isLocked, true);
        const rewardWon = spinAndWinReward();
        alert(`🎉 Spin & Win Bonus! You won extra ${rewardWon} reward points for sending a Money Wish!`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});
