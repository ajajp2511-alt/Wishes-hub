export function routePaymentGateway(countryCode) {
    if (countryCode === 'IN') return 'Razorpay / UPI Gateway';
    return 'Stripe Global Checkout';
}
