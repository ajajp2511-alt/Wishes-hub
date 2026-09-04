export class WalletUI {
    constructor(core) {
        this.core = core;
    }

    init() {
        this.render();
    }

    render() {
        this.renderWalletsSummary();
        this.renderTransactionLedger();
        this.renderMoneyWishes();
    }

    renderWalletsSummary() {
        const container = document.getElementById('walletSummaryContainer');
        if (!container) return;

        container.innerHTML = '';
        const wallets = this.core.getWallets();

        wallets.forEach(w => {
            container.innerHTML += `
                <div class="bg-white border rounded-lg p-4 shadow-xs flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-bold text-sm text-gray-800">${w.name}</span>
                            <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-semibold">${w.tier} Tier</span>
                        </div>
                        <p class="text-xs text-gray-500 mb-3">${w.email}</p>
                        <div class="bg-slate-50 border rounded p-2.5 mb-2">
                            <span class="text-[10px] text-gray-400 uppercase font-bold block">Available Balance</span>
                            <span class="text-lg font-extrabold text-indigo-600">₹${w.balance.toLocaleString()}</span>
                        </div>
                        <p class="text-xs text-emerald-600 font-medium">Reward Points: ${w.rewardPoints} pts</p>
                    </div>
                    <div class="mt-3 pt-3 border-t flex gap-2">
                        <button onclick="window.openManualModal('${w.email}')" class="flex-1 text-xs bg-slate-100 text-slate-700 py-1.5 rounded hover:bg-slate-200 transition font-semibold">Adjust</button>
                        <button onclick="window.requestUserWithdrawal('${w.email}')" class="flex-1 text-xs bg-indigo-600 text-white py-1.5 rounded hover:bg-indigo-700 transition font-semibold">Withdraw</button>
                    </div>
                </div>
            `;
        });
    }

    renderTransactionLedger() {
        const container = document.getElementById('transactionLedgerContainer');
        if (!container) return;

        container.innerHTML = '';
        const ledger = this.core.getLedger();

        ledger.forEach(txn => {
            let badgeClass = 'ledger-badge-success';
            if (txn.status === 'Pending') badgeClass = 'ledger-badge-pending';
            if (txn.status === 'Escalated' || txn.status === 'Escrow') badgeClass = 'ledger-badge-escrow';

            container.innerHTML += `
                <tr class="border-b hover:bg-slate-50 text-xs">
                    <td class="p-3 font-mono font-bold text-gray-600">${txn.id}</td>
                    <td class="p-3 text-gray-500">${txn.timestamp}</td>
                    <td class="p-3 text-gray-800 font-medium">${txn.userEmail}</td>
                    <td class="p-3 text-indigo-600 font-semibold">${txn.type}</td>
                    <td class="p-3 font-bold text-gray-900">₹${txn.amount}</td>
                    <td class="p-3 text-gray-500">${txn.gateway}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded-full font-medium ${badgeClass}">${txn.status}</span></td>
                    <td class="p-3 font-mono text-gray-400">${txn.wishId}</td>
                </tr>
            `;
        });
    }

    renderMoneyWishes() {
        const container = document.getElementById('moneyWishesContainer');
        if (!container) return;

        container.innerHTML = '';
        const wishes = this.core.getMoneyWishes();

        wishes.forEach(mw => {
            container.innerHTML += `
                <div class="bg-amber-50/60 border border-amber-200 rounded-lg p-3 text-xs mb-2 flex justify-between items-center">
                    <div>
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="font-bold text-amber-900 font-mono">${mw.wishId}</span>
                            <span class="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-semibold">₹${mw.amount} Net Gift</span>
                        </div>
                        <p class="text-amber-800">From: <strong>${mw.sender}</strong> → To: <strong>${mw.recipient}</strong></p>
                        <p class="text-gray-600 italic mt-0.5">"${mw.note}"</p>
                    </div>
                    <div>
                        <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded font-bold">${mw.status}</span>
                    </div>
                </div>
            `;
        });
    }
}
