export function triggerSmartCaptcha(riskScore) {
    return riskScore > 0.6 ? 'Challenge Required' : 'Bypass Granted';
}
