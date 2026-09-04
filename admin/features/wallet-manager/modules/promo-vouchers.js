export function handleCreateVoucher(core, code, amount) {
    core.vouchers.push({ code, amount, status: 'Active', usedBy: null });
    return true;
}
