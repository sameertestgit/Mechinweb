import { getUSDToINRRate } from '../utils/currency';

export interface PricingTier {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface ServicePricing {
  id: string;
  name: string;
  description: string;
  tiers: {
    basic: PricingTier;
    standard?: PricingTier;
    enterprise?: PricingTier;
  };
}

export const servicePricing: Record<string, ServicePricing> = {
  'email-migration': {
    id: 'email-migration',
    name: 'Email Migration & Setup',
    description: 'Per mailbox migration with zero downtime',
    tiers: {
      basic: {
        name: 'Per Mailbox',
        price: 4,
        features: [
          'Complete mailbox migration',
          'Email backup included',
          'Zero downtime migration',
          'Basic support'
        ]
      }
    }
  },
  'email-deliverability': {
    id: 'email-deliverability',
    name: 'Email Deliverability',
    description: 'Complete DNS and email authentication setup',
    tiers: {
      basic: {
        name: 'Complete Setup',
        price: 25,
        features: [
          'SPF, DKIM, DMARC setup',
          'DNS configuration',
          'Deliverability optimization',
          'Email support'
        ]
      }
    }
  },
  'ssl-setup': {
    id: 'ssl-setup',
    name: 'SSL & HTTPS Setup',
    description: 'Professional SSL certificate installation and management',
    tiers: {
      basic: {
        name: 'Single Domain',
        price: 15,
        features: [
          'SSL certificate installation',
          'HTTPS configuration',
          'Security validation',
          'Basic support'
        ]
      },
      standard: {
        name: 'Multi-Domain',
        price: 35,
        features: [
          'Up to 5 domains',
          'Everything in Single Domain',
          'Centralized management',
          'Priority support'
        ],
        popular: true
      },
      enterprise: {
        name: 'Wildcard SSL',
        price: 65,
        features: [
          'Unlimited subdomains',
          'Everything in Multi-Domain',
          'Auto-renewal setup',
          'Advanced monitoring',
          '24/7 support'
        ]
      }
    }
  },
  'cloud-management': {
    id: 'cloud-management',
    name: 'Cloud Suite Management',
    description: 'Expert administration of Google Workspace and Microsoft 365',
    tiers: {
      basic: {
        name: 'Setup',
        price: 25,
        features: [
          'Initial setup',
          'User configuration',
          'Basic training',
          'Documentation'
        ]
      },
      standard: {
        name: 'Advanced',
        price: 45,
        features: [
          'Monthly management',
          'Everything in Setup',
          'Ongoing optimization',
          'User support',
          'Security monitoring'
        ],
        popular: true
      },
      enterprise: {
        name: 'Enterprise',
        price: 85,
        features: [
          'Everything in Advanced',
          'Dedicated manager',
          '24/7 support',
          'Custom integrations',
          'Advanced analytics'
        ]
      }
    }
  },
  'data-migration': {
    id: 'data-migration',
    name: 'Cloud Data Migration',
    description: 'Per drive/site/Teams chat migration',
    tiers: {
      basic: {
        name: 'Per Item',
        price: 5,
        features: [
          'Per drive migration',
          'Per site migration',
          'Per Teams chat migration',
          'Data integrity checks'
        ]
      }
    }
  },
  'hosting-support': {
    id: 'hosting-support',
    name: 'Hosting & Control Panel Support',
    description: 'Professional hosting management and optimization',
    tiers: {
      basic: {
        name: 'Basic',
        price: 15,
        features: [
          'Basic troubleshooting',
          'Performance optimization',
          'Email support',
          'Monthly check-up'
        ]
      },
      standard: {
        name: 'Standard',
        price: 25,
        features: [
          'Everything in Basic',
          'Priority support',
          'Security hardening',
          'Weekly monitoring',
          'Backup management'
        ],
        popular: true
      },
      enterprise: {
        name: 'Enterprise',
        price: 55,
        features: [
          'Everything in Standard',
          '24/7 monitoring',
          'Dedicated support',
          'Custom configurations',
          'Emergency response'
        ]
      }
    }
  },
  'acronis-setup': {
    id: 'acronis-setup',
    name: 'Acronis Account Setup (Data Backup & Recovery)',
    description: 'One-time Acronis backup solution setup and configuration',
    tiers: {
      basic: {
        name: 'Complete Setup',
        price: 25,
        features: [
          'Acronis account creation',
          'Complete configuration',
          'Multi-device setup',
          'Training and support'
        ]
      }
    }
  }
};

export class PricingService {
  static async getLocalizedPrice(
    serviceId: string,
    tier: string,
    currency: 'USD' | 'INR' = 'USD'
  ): Promise<number> {
    const service = servicePricing[serviceId];
    if (!service || !service.tiers[tier as keyof typeof service.tiers]) {
      throw new Error('Invalid service or tier');
    }

    const usdPrice = service.tiers[tier as keyof typeof service.tiers].price;

    if (currency === 'INR') {
      const exchangeRate = await getUSDToINRRate();
      return Math.round(usdPrice * exchangeRate);
    }

    return usdPrice;
  }

  static getAllServices(): ServicePricing[] {
    return Object.values(servicePricing);
  }

  static getService(serviceId: string): ServicePricing | null {
    return servicePricing[serviceId] || null;
  }
}