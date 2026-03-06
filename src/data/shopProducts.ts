export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  sizes: string[];
  colors: string[];
  images: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  metadata: Record<string, any>;
}

export interface ShopCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface ShopSubcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sort_order: number;
}

// Category-specific metadata field definitions for dynamic filters
export const categoryFilterConfig: Record<string, { label: string; key: string; type: 'select' | 'range' | 'multiselect' | 'boolean'; options?: string[] }[]> = {
  jeans: [
    { label: 'Fit', key: 'fit', type: 'select', options: ['Slim', 'Skinny', 'Relaxed', 'Flare'] },
    { label: 'Wash', key: 'wash', type: 'select', options: ['Dark Indigo', 'Black', 'Stone Wash', 'Light Wash', 'Medium Blue', 'Raw Denim', 'Ripped Blue', 'Dark Wash', 'Medium Wash'] },
  ],
  'leather-bags': [
    { label: 'Material', key: 'material', type: 'select', options: ['Full-grain Italian leather', 'Pebbled leather', 'Saffiano leather', 'Vegetable-tanned leather'] },
    { label: 'Has Certificate', key: 'has_certificate', type: 'boolean' },
  ],
  skincare: [
    { label: 'Skin Type', key: 'skin_type', type: 'select', options: ['All', 'Sensitive', 'Oily', 'Dry', 'Mature', 'Combination'] },
    { label: 'Concern', key: 'concern', type: 'multiselect', options: ['Dryness', 'Anti-aging', 'Dark spots', 'Dullness', 'Sensitivity', 'Redness', 'Acne', 'Wrinkles', 'Fine lines', 'Sun protection'] },
  ],
  haircare: [
    { label: 'Hair Type', key: 'hair_type', type: 'select', options: ['All', 'Damaged', 'Oily', 'Dry', 'Curly', 'Fine'] },
    { label: 'Scent', key: 'scent', type: 'select', options: ['Fresh Citrus', 'Lavender', 'Vanilla Rose', 'Coconut', 'Unscented'] },
    { label: 'Concern', key: 'concern', type: 'multiselect', options: ['Damage repair', 'Frizz', 'Smoothing', 'Hydration', 'Shine', 'Frizz control', 'Strengthening'] },
  ],
  cosmetics: [
    { label: 'Finish', key: 'finish', type: 'select', options: ['Matte', 'Dewy', 'Shimmer & Matte', 'Volumizing', 'Satin'] },
    { label: 'Waterproof', key: 'waterproof', type: 'boolean' },
  ],
  jewelry: [
    { label: 'Metal', key: 'metal', type: 'select', options: ['18K Gold', '14K Gold', 'Sterling Silver', 'Platinum'] },
    { label: 'Metal Purity', key: 'metal_purity', type: 'select', options: ['750', '925', '585', '950'] },
    { label: 'Gemstone', key: 'gemstone', type: 'select', options: ['Diamond', 'Freshwater Pearl', 'Blue Sapphire', 'Ruby', 'Emerald'] },
    { label: 'Has Certificate', key: 'has_certificate', type: 'boolean' },
  ],
  undergarments: [
    { label: 'Material', key: 'material', type: 'select', options: ['Cotton blend', 'Lace & Cotton', '100% Cotton', 'Nylon Spandex'] },
    { label: 'Privacy Packaging', key: 'privacy_packaging', type: 'boolean' },
  ],
};

// Concern-based landing page data for beauty
export const shopByConcernData = [
  { id: 'acne', label: 'Acne-Prone', icon: '🔴', description: 'Products for acne-prone skin', concerns: ['Acne', 'Sensitivity'] },
  { id: 'anti-aging', label: 'Anti-Aging', icon: '✨', description: 'Turn back the clock', concerns: ['Anti-aging', 'Wrinkles', 'Fine lines'] },
  { id: 'dryness', label: 'Dry Skin', icon: '💧', description: 'Deep hydration solutions', concerns: ['Dryness', 'Hydration'] },
  { id: 'brightening', label: 'Brightening', icon: '☀️', description: 'Radiant, even-toned skin', concerns: ['Dark spots', 'Dullness'] },
  { id: 'sensitive', label: 'Sensitive Skin', icon: '🌿', description: 'Gentle, soothing care', concerns: ['Sensitivity', 'Redness'] },
  { id: 'sun-care', label: 'Sun Protection', icon: '🛡️', description: 'UV defense essentials', concerns: ['Sun protection'] },
];

export const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-30', label: 'Under $30' },
  { value: '30-60', label: '$30 - $60' },
  { value: '60-100', label: '$60 - $100' },
  { value: '100-300', label: '$100 - $300' },
  { value: '300-9999', label: '$300+' },
];
