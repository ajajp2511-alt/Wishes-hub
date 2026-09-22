export class WalletUI {
    constructor(core) {
        this.core = core;
    }

    init(container) {
        if (container) {
            container.innerHTML = `
                <div class="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
                        <div>
                            <h2 class="text-xl font-bold text-gray-800">Wallet & Financial Ledger</h2>
                            <p class="text-sm text-gray-500">Monitor user balances, track transactions, and manage money wishes.</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="window.triggerSendMoneyWishModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
                                <i class="fa-solid fa-gift"></i> Send Money Wish
                            </button>
                        </div>
                    </div>

                    <!-- Wallets Summary Grid -->
                    <div class="space-y-3">
                        <h3 class="text-md font-semibold text-gray-700">User Wallets Overview</h3>
                        <div id="walletSummaryContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
                    </div>

                    <!-- Money Wishes Section -->
                    <div class="space-y-3 mt-6">
                        <h3 class="text-md font-semibold text-gray-700">Active Money Wishes</h3>
                        <div id="moneyWishesContainer" class="space-y-2"></div>
                    </div>

                    <!-- Transaction Ledger Section -->
                    <div class="bg-white border rounded-xl shadow-sm overflow-hidden mt-8">
                        <div class="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 class="text-md font-semibold text-gray-700">Transaction Ledger</h3>
                            <span class="text-xs text-gray-500 font-mono">Real-time Financial Activity</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase">
                                        <th class="p-3">TXN ID</th>
                                        <th class="p-3">Timestamp</th>
                                        <th class="p-3">User Email</th>
                                        <th class="p-3">Type</th>
                                        <th class="p-3">Amount</th>
                                        <th class="p-3">Gateway</th>
                                        <th class="p-3">Status</th>
                                        <th class="p-3">Wish ID</th>
                                    </tr>
                                </thead>
                                <tbody id="transactionLedgerContainer"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }

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
            let badgeClass = 'bg-green-100 text-green-800';
            if (txn.status === 'Pending') badgeClass = 'bg-yellow-100 text-yellow-800';
            if (txn.status === 'Escalated' || txn.status === 'Escrow') badgeClass = 'bg-purple-100 text-purple-800';

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
