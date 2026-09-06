export function evaluateTimeBasedAccess(hourOfDay) {
    return hourOfDay >= 1 && hourOfDay <= 5 ? 'High Risk Window' : 'Normal Access Window';
}
