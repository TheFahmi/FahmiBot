// Definisi untuk auto clicker
export interface AutoClicker {
  id: string;
  name: string;
  description: string;
  cost: number;
  clicksPerSecond: number;
  level: number;
  maxLevel: number;
  upgradeCost: number;
  upgradeMultiplier: number;
  imageUrl?: string;
  owned: boolean;
}

// Daftar auto clicker default
export const AUTO_CLICKERS: AutoClicker[] = [
  {
    id: 'autoclicker_1',
    name: 'Magang',
    description: 'Magang yang mengklik untuk Anda 1 kali per detik',
    cost: 50,
    clicksPerSecond: 1,
    level: 0,
    maxLevel: 10,
    upgradeCost: 25,
    upgradeMultiplier: 1.5,
    imageUrl: 'https://via.placeholder.com/50',
    owned: false,
  },
  {
    id: 'autoclicker_2',
    name: 'Staff',
    description: 'Staff yang mengklik untuk Anda 5 kali per detik',
    cost: 250,
    clicksPerSecond: 5,
    level: 0,
    maxLevel: 10,
    upgradeCost: 100,
    upgradeMultiplier: 1.5,
    imageUrl: 'https://via.placeholder.com/50',
    owned: false,
  },
  {
    id: 'autoclicker_3',
    name: 'Supervisor',
    description: 'Supervisor yang mengklik untuk Anda 20 kali per detik',
    cost: 1000,
    clicksPerSecond: 20,
    level: 0,
    maxLevel: 5,
    upgradeCost: 500,
    upgradeMultiplier: 2,
    imageUrl: 'https://via.placeholder.com/50',
    owned: false,
  },
]; 