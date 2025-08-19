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
    standard: PricingTier;
    enterprise: PricingTier;
  };
}

export const servicePricing: Record<string, ServicePricing> = {
  'email-migration': {
    id: 'email-migration',
    name: 'Email Migration & Setup',
    description: 'Seamless email migration between platforms with zero downtime',
    tiers: {
      basic: {
        name: 'Basic',
        price: 299,
        features: [
          'Up to 10 email accounts',
          'Basic migration support',
          'Email backup included',
          '48-hour completion'
        ]
      },
      standard: {
        name: 'Standard',
        price: 799,
        features: [
          'Up to 50 email accounts',
          'Priority migration support',
          'Advanced configuration',
          '24-hour completion',
          '30-day post-migration support'
        ],
        popular: true
      },
      enterprise: {
        name: 'Enterprise',
        price: 1499,
        features: [
          'Unlimited email accounts',
          'Dedicated project manager',
          'Custom integrations',
          'Same-day completion',
          '90-day premium support'
        ]
      }
    }
  },
  'email-security': {
    id: 'email-security',
    name: 'Domain & Email Security',
    description: 'Complete DNS and email authentication setup',
    tiers: {
      basic: {
        name: 'Basic Setup',
        price: 199,
        features: [
          'SPF, DKIM, DMARC setup',
          'Basic DNS configuration',
          'Email support',
          'Setup documentation'
        ]
      },
      standard: {
        name: 'Advanced',
        price: 399,
        features: [
          'Everything in Basic',
          'Security monitoring',
          'Monthly reports',
          'Priority support',
          'Custom policies'
        ],
        popular: true
      },
      enterprise: {
        name: 'Enterprise',
        price: 799,
        features: [
          'Everything in Advanced',
          '24/7 monitoring',
          'Dedicated security expert',
          'Compliance reporting',
          'Advanced threat protection'
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
        price: 149,
        features: [
          'SSL certificate installation',
          'HTTPS configuration',
          'Security validation',
          'Basic support'
        ]
      },
      standard: {
        name: 'Multi-Domain',
        price: 299,
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
        price: 499,
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
        price: 399,
        features: [
          'Initial setup',
          'User configuration',
          'Basic training',
          'Documentation'
        ]
      },
      standard: {
        name: 'Advanced',
        price: 299,
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
        price: 599,
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
    description: 'Secure migration between cloud platforms',
    tiers: {
      basic: {
        name: 'Basic',
        price: 499,
        features: [
          'Up to 100GB data',
          'Basic migration tools',
          'Standard support',
          '7-day completion'
        ]
      },
      standard: {
        name: 'Standard',
        price: 999,
        features: [
          'Up to 1TB data',
          'Advanced migration tools',
          'Priority support',
          '3-day completion',
          'Data validation'
        ],
        popular: true
      },
      enterprise: {
        name: 'Enterprise',
        price: 1999,
        features: [
          'Unlimited data',
          'Enterprise migration tools',
          'Dedicated project manager',
          '24-hour completion',
          'Full compliance reporting'
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
        price: 149,
        features: [
          'Basic troubleshooting',
          'Performance optimization',
          'Email support',
          'Monthly check-up'
        ]
      },
      standard: {
        name: 'Standard',
        price: 199,
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
        price: 399,
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
    description: 'Professional Acronis backup solution setup and configuration',
    tiers: {
      basic: {
        name: 'Basic Setup',
        price: 199,
        features: [
          'Acronis account creation',
          'Basic backup configuration',
          'Single device setup',
          'Email support'
        ]
      },
      standard: {
        name: 'Advanced Setup',
        price: 399,
        features: [
          'Everything in Basic',
          'Multiple device setup',
          'Automated backup schedules',
          'Recovery testing',
          'Priority support'
        ],
        popular: true
      },
      enterprise: {
        name: 'Enterprise Setup',
        price: 799,
        features: [
          'Everything in Advanced',
          'Custom backup policies',
          'Disaster recovery planning',
          'Dedicated support',
          'Training sessions'
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