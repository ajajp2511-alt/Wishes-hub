/**
 * Main Assembly Controller - AI & Automation Studio
 * Path: admin/features/ai-automation/ai-assembly.js
 */

import { aiCoreInstance } from './ai-core.js';
import { WishGeneratorModule } from './modules/wish-generator.js';
import { PromptPresetsModule } from './modules/prompt-presets.js';
import { MultiLanguageTranslatorModule } from './modules/multi-language-translator.js';
import { SeasonalAutoPilotModule } from './modules/seasonal-auto-pilot.js';
import { AiOcrExtractorModule } from './modules/ai-ocr-extractor.js';
import { VoiceAudioAiModule } from './modules/voice-audio-ai.js';
import { PoetryRhymeStudioModule } from './modules/poetry-rhyme-studio.js';
import { ContentModeratorModule } from './modules/content-moderator.js';
import { TokenCostAnalyzerModule } from './modules/token-cost-analyzer.js';

export class AIAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'wish-generator';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="ai-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">AI & Automation Studio</h2>
          <small style="color:#6e7681;">Text Generation, Translation, OCR, Voice, Poetry & Token Analytics</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="wish-generator">Wish Generator</button>
          <button class="tab-btn" data-subtab="prompt-presets">Prompt Presets</button>
          <button class="tab-btn" data-subtab="translator">Multi-Language Translator</button>
          <button class="tab-btn" data-subtab="auto-pilot">Seasonal Auto-Pilot</button>
          <button class="tab-btn" data-subtab="ocr-extractor">Card OCR</button>
          <button class="tab-btn" data-subtab="voice-ai">Voice & Audio AI</button>
          <button class="tab-btn" data-subtab="poetry-studio">Poetry & Shayari</button>
          <button class="tab-btn" data-subtab="content-moderator">Content Safety</button>
          <button class="tab-btn" data-subtab="token-analytics">Token Analytics</button>
        </nav>

        <main id="ai-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#ai-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'wish-generator': WishGeneratorModule.render(view, aiCoreInstance); break;
      case 'prompt-presets': PromptPresetsModule.render(view, aiCoreInstance); break;
      case 'translator': MultiLanguageTranslatorModule.render(view); break;
      case 'auto-pilot': SeasonalAutoPilotModule.render(view); break;
      case 'ocr-extractor': AiOcrExtractorModule.render(view); break;
      case 'voice-ai': VoiceAudioAiModule.render(view); break;
      case 'poetry-studio': PoetryRhymeStudioModule.render(view); break;
      case 'content-moderator': ContentModeratorModule.render(view); break;
      case 'token-analytics': TokenCostAnalyzerModule.render(view, aiCoreInstance); break;
      default: WishGeneratorModule.render(view, aiCoreInstance); break;
    }
  }

  attachEventListeners() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.fontWeight = 'normal';
        });
        
        e.target.classList.add('active');
        e.target.style.fontWeight = 'bold';
        
        this.activeSubTab = e.target.dataset.subtab;
        this.renderActiveSubTab();
      });
    });
  }
}

export const aiAssemblyInstance = new AIAssembly();
