export function convertToUSDT(inrAmount) {
    const rate = 83.5; // Mock exchange rate
    return (inrAmount / rate).toFixed(2);
}
