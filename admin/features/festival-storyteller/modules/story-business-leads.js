/**
 * story-business-leads.js
 * Local Vendor Partnerships & Event Service Lead Generator
 * Location: wishes-hub/admin/features/festival-storyteller/modules/story-business-leads.js
 */

const FestivalStoryConfig = require('../festival-story-config');

class StoryBusinessLeads {
  constructor() {
    this.name = "StoryBusinessLeads";
    this.config = FestivalStoryConfig;
  }

  /**
   * Fetch relevant vendor service categories for the festival
   * @param {string} category - Festival category ('religious', 'cultural', etc.)
   * @param {string} festivalSlug - Unique route slug
   * @returns {Object} Structured service leads payload
   */
  getLeadServices(category, festivalSlug) {
    if (!this.config.featuresEnabled.businessLeads) {
      return { enabled: false, services: [] };
    }

    const availableServices = [
      {
        id: "lead-pandit",
        serviceName: "Book Experienced Pandit / Priest for Puja",
        category: "Religious Services",
        icon: "🛕",
        description: "Connect with certified local Pandits for authentic Vedic rituals and auspicious muhurat pujas.",
        ctaText: "Request Callback"
      },
      {
        id: "lead-catering",
        serviceName: "Festive Food Catering & Sweets Bulk Order",
        category: "Catering",
        icon: "🍲",
        description: "Get quotes from top-rated local caterers for traditional festive meals and sweet boxes.",
        ctaText: "Get Free Quote"
      },
      {
        id: "lead-decor",
        serviceName: "Home & Venue Event Decorators",
        category: "Event Decor",
        icon: "✨",
        description: "Professional decoration services for lighting, floral themes, and stage setups.",
        ctaText: "Connect with Vendors"
      }
    ];

    return {
      enabled: true,
      festivalSlug: festivalSlug,
      title: "Local Festival Services & Vendor Directory",
      subtitle: "Connect with trusted service providers near you for hassle-free celebrations.",
      services: availableServices
    };
  }

  /**
   * Process and validate lead inquiry submission
   * @param {Object} leadData - Form submission data { name, phone, city, serviceId, festivalSlug }
   * @returns {Object} Processing response status
   */
  submitLeadInquiry(leadData) {
    if (!leadData || !leadData.phone || !leadData.serviceId) {
      return {
        success: false,
        message: "Invalid submission. Please provide contact number and service selection."
      };
    }

    console.log(`[StoryBusinessLeads] New Lead Recorded for ${leadData.festivalSlug}:`, leadData);

    return {
      success: true,
      leadId: `LEAD-${Date.now()}`,
      message: "Thank you! Our local partner will contact you shortly with quotes."
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = StoryBusinessLeads;
}
