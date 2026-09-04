export function getAIGiftingSuggestion(occasion) {
    if (occasion === 'Birthday') return { recommendedAmount: 500, suggestion: 'Happy Birthday! Add a cake animation with ₹500.' };
    if (occasion === 'Wedding') return { recommendedAmount: 2000, suggestion: 'Congratulations! A gold-tier pooled gift of ₹2000 is ideal.' };
    return { recommendedAmount: 250, suggestion: 'Send a warm greeting with a ₹250 token tip.' };
}
