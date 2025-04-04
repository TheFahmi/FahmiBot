export interface Manager {
  id: string;
  name: string;
  description?: string;
  price: number;
  businessId: string;
  hired: boolean;
  effect?: 'autoCollect' | 'speedBoost' | 'incomeBoost';
  effectValue?: number;
  imageUrl?: string;
}

export interface BusinessManager {
  businessId: string;
  managerId: string;
} 