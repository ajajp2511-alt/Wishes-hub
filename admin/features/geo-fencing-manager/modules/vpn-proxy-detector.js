export function evaluateVpnRisk(ipString) {
    if (ipString.includes('datacenter')) return { risk: 'High', action: 'Block' };
    return { risk: 'Low', action: 'Allow' };
}
