export function verifyVipException(email) {
    return email.includes('admin@wishes-hub') || email.includes('partner@');
}
