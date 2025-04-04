export interface Upgrade {
  id: string;
  name: string;
  description: string;
  price: number;
  businessId: string;
  multiplier: number;
  icon?: string;
  unlockBusinessLevel?: number;
  purchased: boolean;
}

export interface BusinessUpgrade {
  businessId: string;
  upgradeIds: string[];
} 