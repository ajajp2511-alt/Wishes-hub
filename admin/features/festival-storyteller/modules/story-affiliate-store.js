/**
 * story-affiliate-store.js
 * E-commerce Affiliate Product Recommendations & Puja Samagri Store
 * Location: wishes-hub/admin/features/festival-storyteller/modules/story-affiliate-store.js
 */

const FestivalStoryConfig = require('../festival-story-config');

class StoryAffiliateStore {
  constructor() {
    this.name = "StoryAffiliateStore";
    this.config = FestivalStoryConfig;
  }

  /**
   * Retrieve curated affiliate products based on festival category and slug
   * @param {string} category - Festival category ('religious', 'cultural', etc.)
   * @param {string} festivalSlug - Unique route slug
   * @returns {Object} Structured list of recommended products
   */
  getProducts(category, festivalSlug) {
    if (!this.config.featuresEnabled.affiliateProducts) {
      return { enabled: false, products: [] };
    }

    const productsMap = {
      religious: [
        {
          id: "aff-01",
          title: "Complete Festival Puja Samagri Kit",
          category: "Puja Essentials",
          price: "₹499",
          rating: 4.8,
          imageUrl: "/assets/images/store/puja-kit.jpg",
          buyUrl: `https://affiliate.wisheshub.com/redirect?item=puja-kit&ref=${festivalSlug}`,
          badge: "Bestseller"
        },
        {
          id: "aff-02",
          title: "Handcrafted Pure Brass Diya & Oil Lamp",
          category: "Home Decor",
          price: "₹299",
          rating: 4.7,
          imageUrl: "/assets/images/store/brass-diya.jpg",
          buyUrl: `https://affiliate.wisheshub.com/redirect?item=brass-diya&ref=${festivalSlug}`,
          badge: "Popular"
        },
        {
          id: "aff-03",
          title: "Organic Rangoli Color Powder Set (10 Pack)",
          category: "Decorations",
          price: "₹199",
          rating: 4.9,
          imageUrl: "/assets/images/store/rangoli-colors.jpg",
          buyUrl: `https://affiliate.wisheshub.com/redirect?item=rangoli-colors&ref=${festivalSlug}`,
          badge: "Eco-Friendly"
        }
      ],
      cultural: [
        {
          id: "aff-04",
          title: "Festive Decorative LED String Lights (10m)",
          category: "Lighting",
          price: "₹349",
          rating: 4.6,
          imageUrl: "/assets/images/store/led-lights.jpg",
          buyUrl: `https://affiliate.wisheshub.com/redirect?item=led-lights&ref=${festivalSlug}`,
          badge: "Trending"
        },
        {
          id: "aff-05",
          title: "Premium Handcrafted Gift Hamper Box",
          category: "Gifting",
          price: "₹799",
          rating: 4.9,
          imageUrl: "/assets/images/store/gift-hamper.jpg",
          buyUrl: `https://affiliate.wisheshub.com/redirect?item=gift-hamper&ref=${festivalSlug}`,
          badge: "Premium Choice"
        }
      ]
    };

    const recommendedList = productsMap[category] || productsMap.cultural;

    return {
      enabled: true,
      festivalSlug: festivalSlug,
      storeTitle: "Festive Essentials & Celebration Shopping",
      products: recommendedList
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = StoryAffiliateStore;
}
