/**
 * Main Assembly Controller - Price & Plans
 * Path: admin/features/price-plans/pricing-assembly.js
 */

import { pricingCoreInstance } from './pricing-core.js';
import { PricingPackagesModule } from './modules/pricing-packages.js';
import { PromoCodesModule } from './modules/promo-codes.js';
import { PaymentGatewaysModule } from './modules/payment-gateways.js';
import { SubscriptionInvoicingModule } from './modules/subscription-invoicing.js';
import { FestiveFlashSalesModule } from './modules/festive-flash-sales.js';
import { AffiliateReferralsModule } from './modules/affiliate-referrals.js';
import { RefundsDisputesDeskModule } from './modules/refunds-disputes-desk.js';
import { MicroTransactionsStoreModule } from './modules/micro-transactions-store.js';
import { PppCurrencyConverterModule } from './modules/ppp-currency-converter.js';
import { QuotaMeteringEngineModule } from './modules/quota-metering-engine.js';
import { DigitalWalletCoinsModule } from './modules/digital-wallet-coins.js';
import { B2bCorporateSponsorshipsModule } from './modules/b2b-corporate-sponsorships.js';
import { ChurnSaverRetentionModule } from './modules/churn-saver-retention.js';
import { FraudChargebackGuardModule } from './modules/fraud-chargeback-guard.js';
import { UpsellCrosssellEngineModule } from './modules/upsell-crosssell-engine.js';
import { DunningFailedPaymentRecoveryModule } from './modules/dunning-failed-payment-recovery.js';
import { GstTaxComplianceModule } from './modules/gst-tax-compliance.js';
import { GiftCardsVouchersModule } from './modules/gift-cards-vouchers.js';

export class PricingAssembly {
  constructor() {
    this.container = null;
    this.activeSubTab = 'packages';
  }

  init(rootId) {
    this.container = document.getElementById(rootId);
    if (!this.container) return;

    this.renderLayout();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="pricing-manager-container" style="padding:16px;">
        <header style="margin-bottom:20px;">
          <h2 style="margin:0;">Price & Plans Monetization Studio</h2>
          <small style="color:#6e7681;">Packages, Promos, Payment Gateways & Revenue Engine</small>
        </header>

        <nav style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
          <button class="tab-btn active" data-subtab="packages">Packages</button>
          <button class="tab-btn" data-subtab="promos">Promo Codes</button>
          <button class="tab-btn" data-subtab="gateways">Gateways</button>
          <button class="tab-btn" data-subtab="invoicing">Invoices</button>
          <button class="tab-btn" data-subtab="flash-sales">Flash Sales</button>
          <button class="tab-btn" data-subtab="affiliate">Affiliates</button>
          <button class="tab-btn" data-subtab="refunds">Refund Desk</button>
          <button class="tab-btn" data-subtab="micro-store">Pay-Per-Card</button>
          <button class="tab-btn" data-subtab="ppp">PPP Currency</button>
          <button class="tab-btn" data-subtab="quota">Usage Metering</button>
          <button class="tab-btn" data-subtab="wallet">Coins Wallet</button>
          <button class="tab-btn" data-subtab="b2b">B2B Sponsorship</button>
          <button class="tab-btn" data-subtab="churn-saver">Retention Guard</button>
          <button class="tab-btn" data-subtab="fraud-guard">Fraud Guard</button>
          <button class="tab-btn" data-subtab="upsell">Checkout Upsell</button>
          <button class="tab-btn" data-subtab="dunning">Recovery Dunning</button>
          <button class="tab-btn" data-subtab="gst">GST Tax</button>
          <button class="tab-btn" data-subtab="gift-cards">Gift Cards</button>
        </nav>

        <main id="pricing-main-view"></main>
      </div>
    `;

    this.renderActiveSubTab();
  }

  renderActiveSubTab() {
    const view = this.container.querySelector('#pricing-main-view');
    if (!view) return;

    switch (this.activeSubTab) {
      case 'packages': PricingPackagesModule.render(view, pricingCoreInstance); break;
      case 'promos': PromoCodesModule.render(view, pricingCoreInstance); break;
      case 'gateways': PaymentGatewaysModule.render(view, pricingCoreInstance); break;
      case 'invoicing': SubscriptionInvoicingModule.render(view); break;
      case 'flash-sales': FestiveFlashSalesModule.render(view); break;
      case 'affiliate': AffiliateReferralsModule.render(view); break;
      case 'refunds': RefundsDisputesDeskModule.render(view); break;
      case 'micro-store': MicroTransactionsStoreModule.render(view); break;
      case 'ppp': PppCurrencyConverterModule.render(view); break;
      case 'quota': QuotaMeteringEngineModule.render(view); break;
      case 'wallet': DigitalWalletCoinsModule.render(view); break;
      case 'b2b': B2bCorporateSponsorshipsModule.render(view); break;
      case 'churn-saver': ChurnSaverRetentionModule.render(view); break;
      case 'fraud-guard': FraudChargebackGuardModule.render(view); break;
      case 'upsell': UpsellCrosssellEngineModule.render(view); break;
      case 'dunning': DunningFailedPaymentRecoveryModule.render(view); break;
      case 'gst': GstTaxComplianceModule.render(view); break;
      case 'gift-cards': GiftCardsVouchersModule.render(view); break;
      default: PricingPackagesModule.render(view, pricingCoreInstance); break;
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

export const pricingAssemblyInstance = new PricingAssembly();
