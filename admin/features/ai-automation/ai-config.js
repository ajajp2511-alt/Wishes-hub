/**
 * AI & Automation Studio Configuration
 * Path: admin/features/ai-automation/ai-config.js
 */

export const AI_CONFIG = {
  version: '1.0.0',
  defaultModel: 'gemini-1.5-flash',
  apiEndpoint: '/api/ai/generate', // Vercel Serverless Endpoint
  supportedTones: ['Emotional', 'Poetic/Shayari', 'Funny', 'Formal', 'Royal Gold'],
  supportedLanguages: [
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'en', name: 'English' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'te', name: 'Telugu (తెలుగు)' }
  ]
};
