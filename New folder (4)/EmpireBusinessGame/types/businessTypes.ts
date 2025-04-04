export interface Business {
  id: string;
  name: string;
  description: string;
  level: number;
  income: number;
  baseIncome: number;
  upgradeCost: number;
  baseUpgradeCost: number;
  imageUrl?: string;
  managerHired: boolean;
  managerId?: string;
  progress: number;
  unlocked: boolean;
  unlockCost?: number;
} 