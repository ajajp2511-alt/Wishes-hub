/**
 * AI & Automation Studio Core Engine
 * Path: admin/features/ai-automation/ai-core.js
 */

import { AI_CONFIG } from './ai-config.js';

export class AICore {
  constructor() {
    this.prompts = [
      { id: 'p_1', title: 'Diwali Emotional Wishes', category: 'Festive', temperature: 0.7 },
      { id: 'p_2', title: 'Birthday Rhyming Shayari', category: 'Birthday', temperature: 0.85 }
    ];
    this.usageStats = {
      totalTokens: 128400,
      totalRequests: 450,
      estimatedCost: '$0.02'
    };
  }

  getPrompts() { return this.prompts; }
  getUsageStats() { return this.usageStats; }

  async generateWish(payload) {
    // Calls Vercel Serverless Function which uses process.env.GEMINI_API_KEY
    try {
      const response = await fetch(AI_CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      console.error('AI Generation Error:', error);
      return { success: false, text: 'Aapki wish generate karne mein issue aaya. Please try again.' };
    }
  }
}

export const aiCoreInstance = new AICore();
