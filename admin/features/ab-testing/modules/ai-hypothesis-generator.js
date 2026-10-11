/**
 * AI Test Hypothesis Generator Module (Optimized & Interactive)
 * Path: admin/features/ab-testing/modules/ai-hypothesis-generator.js
 */

export class AiHypothesisGeneratorModule {
  static render(container) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #e1e4e8; padding:20px; border-radius:8px;">
        <h4 style="margin-top:0; margin-bottom: 6px;">💡 AI Test Hypothesis Generator</h4>
        <p style="font-size:13px; color:#586069; margin-bottom: 20px;">Analyze drop-off points and automatically receive AI recommendations for new tests.</p>

        <!-- Form controls for AI generation -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; align-items: center;">
          <div style="flex: 1; min-width: 200px;">
            <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; color: #24292e;">Target Section / Page</label>
            <select id="ai-target-page" style="width: 100%; padding: 8px; border: 1px solid #e1e4e8; border-radius: 6px; font-size: 13px; background: #fafbfc;">
              <option value="homepage">Homepage Hero Section</option>
              <option value="greeting-creator">Greeting Card Customizer</option>
              <option value="checkout">Checkout & Monetization Flow</option>
              <option value="auth">Sign Up / Login Modal</option>
            </select>
          </div>
          <div style="align-self: flex-end;">
            <button id="btn-generate-ai" style="background:#0366d6; color:#fff; border:none; padding:9px 16px; border-radius:6px; font-size:13px; cursor:pointer; font-weight:600; display: flex; align-items: center; gap: 6px;">
              ✨ Generate Ideas
            </button>
          </div>
        </div>

        <!-- Results Output Area -->
        <div id="ai-results-area" style="border: 1px dashed #e1e4e8; background: #f6f8fa; padding: 20px; border-radius: 6px; text-align: center; color: #6e7681; font-size: 13px;">
          Select a target section and click <strong>Generate Ideas</strong> to let AI propose high-impact experiments.
        </div>
      </div>
    `;

    // Attach event listener for the generate button
    const generateBtn = container.querySelector('#btn-generate-ai');
    const resultsArea = container.querySelector('#ai-results-area');
    const targetSelect = container.querySelector('#ai-target-page');

    generateBtn.addEventListener('click', () => {
      const selectedPage = targetSelect.options[targetSelect.selectedIndex].text;
      
      // Show loading state
      generateBtn.disabled = true;
      generateBtn.style.opacity = '0.7';
      resultsArea.innerHTML = `
        <div style="padding: 20px; color: #0366d6; font-weight: 500;">
          🔄 AI is analyzing traffic drop-offs for <strong>${selectedPage}</strong>...
        </div>
      `;

      // Simulate AI response delay
      setTimeout(() => {
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';

        resultsArea.innerHTML = `
          <div style="text-align: left;">
            <h5 style="margin: 0 0 10px 0; color: #24292e; font-size: 14px;">🎯 AI Recommended Hypotheses:</h5>
            <div style="background: #fff; border: 1px solid #e1e4e8; padding: 12px; border-radius: 6px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <strong style="color: #0366d6;">Idea #1: Simplified Value Proposition</strong>
                <span style="background: #e6ffed; color: #28a745; padding: 2px 6px; border-radius: 10px; font-weight: bold;">Impact: High</span>
              </div>
              <p style="margin: 0; font-size: 13px; color: #24292e;">Changing the primary CTA color and reducing headline length will increase conversion rate by ~14% based on similar user flows.</p>
            </div>
            <div style="background: #fff; border: 1px solid #e1e4e8; padding: 12px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <strong style="color: #0366d6;">Idea #2: Interactive Preview Badge</strong>
                <span style="background: #fff8c5; color: #b08800; padding: 2px 6px; border-radius: 10px; font-weight: bold;">Impact: Medium</span>
              </div>
              <p style="margin: 0; font-size: 13px; color: #24292e;">Adding a live preview badge near the action trigger reduces hesitation and boosts engagement.</p>
            </div>
          </div>
        `;
      }, 1200);
    });
  }
}
