/**
 * Product Catalog - Server-Side Price Authority
 *
 * SECURITY: This is the single source of truth for product prices.
 * Never trust client-provided prices - always verify against this catalog.
 */

export interface Product {
  slug: string;
  name: string;
  description: string;
  price: number; // Price in dollars
  category: 'service' | 'consultation' | 'package';
  active: boolean;
}

/**
 * Product catalog with authoritative pricing
 * Add new products here to make them available for checkout
 */
export const PRODUCT_CATALOG: Record<string, Product> = {
  // Consultation packages
  'consultation-free': {
    slug: 'consultation-free',
    name: 'Free Consultation',
    description: '30-minute discovery call',
    price: 0,
    category: 'consultation',
    active: true,
  },
  'consultation-strategy': {
    slug: 'consultation-strategy',
    name: 'Strategy Session',
    description: '90-minute deep-dive strategy session',
    price: 299,
    category: 'consultation',
    active: true,
  },
  'consultation-premium': {
    slug: 'consultation-premium',
    name: 'Premium Consultation',
    description: 'Half-day comprehensive business consultation',
    price: 799,
    category: 'consultation',
    active: true,
  },

  // Service packages
  'starter-package': {
    slug: 'starter-package',
    name: 'Starter Package',
    description: 'Essential business setup services',
    price: 497,
    category: 'package',
    active: true,
  },
  'growth-package': {
    slug: 'growth-package',
    name: 'Growth Package',
    description: 'Comprehensive growth and scaling services',
    price: 1497,
    category: 'package',
    active: true,
  },
  'enterprise-package': {
    slug: 'enterprise-package',
    name: 'Enterprise Package',
    description: 'Full-service enterprise solutions',
    price: 4997,
    category: 'package',
    active: true,
  },

  // Individual services
  'ein-filing': {
    slug: 'ein-filing',
    name: 'EIN Filing Service',
    description: 'Federal Tax ID number filing assistance',
    price: 99,
    category: 'service',
    active: true,
  },
  'llc-formation': {
    slug: 'llc-formation',
    name: 'LLC Formation',
    description: 'Complete LLC formation service',
    price: 299,
    category: 'service',
    active: true,
  },
  'website-basic': {
    slug: 'website-basic',
    name: 'Basic Website',
    description: '5-page professional website',
    price: 1499,
    category: 'service',
    active: true,
  },
  'website-pro': {
    slug: 'website-pro',
    name: 'Professional Website',
    description: 'Custom website with advanced features',
    price: 3999,
    category: 'service',
    active: true,
  },
  'branding-basic': {
    slug: 'branding-basic',
    name: 'Basic Branding Package',
    description: 'Logo and basic brand identity',
    price: 699,
    category: 'service',
    active: true,
  },
  'branding-pro': {
    slug: 'branding-pro',
    name: 'Professional Branding',
    description: 'Complete brand identity system',
    price: 1999,
    category: 'service',
    active: true,
  },
};

/**
 * Get product by slug
 * Returns undefined if product doesn't exist or is inactive
 */
export function getProduct(slug: string): Product | undefined {
  const product = PRODUCT_CATALOG[slug];
  if (product && product.active) {
    return product;
  }
  return undefined;
}

/**
 * Verify product price matches catalog
 * SECURITY: Use this to validate client-provided prices
 */
export function verifyProductPrice(slug: string, claimedPrice: number): {
  valid: boolean;
  actualPrice?: number;
  product?: Product;
  error?: string;
} {
  const product = getProduct(slug);

  if (!product) {
    return {
      valid: false,
      error: `Product not found: ${slug}`,
    };
  }

  if (product.price !== claimedPrice) {
    return {
      valid: false,
      actualPrice: product.price,
      product,
      error: `Price mismatch for ${slug}: claimed $${claimedPrice}, actual $${product.price}`,
    };
  }

  return {
    valid: true,
    actualPrice: product.price,
    product,
  };
}

/**
 * Get all active products
 */
export function getActiveProducts(): Product[] {
  return Object.values(PRODUCT_CATALOG).filter(p => p.active);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: Product['category']): Product[] {
  return Object.values(PRODUCT_CATALOG).filter(p => p.active && p.category === category);
}
