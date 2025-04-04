// Tipe achievement yang tersedia
export enum AchievementType {
  TOTAL_CLICKS = 'TOTAL_CLICKS',
  TOTAL_MONEY_EARNED = 'TOTAL_MONEY_EARNED',
  TOTAL_UPGRADES = 'TOTAL_UPGRADES',
  TOTAL_TIME_PLAYED = 'TOTAL_TIME_PLAYED',
  HIGHEST_MONEY_PER_SECOND = 'HIGHEST_MONEY_PER_SECOND',
  LOGIN_STREAK = 'LOGIN_STREAK',
}

// Definisi untuk achievement
export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  target: number;
  progress: number;
  reward: number; // Jumlah uang yang didapat
  completed: boolean;
  claimed: boolean;
  imageUrl?: string;
}

// Fungsi untuk mendapatkan semua achievement
export function getAllAchievements(): Achievement[] {
  return [
    // Achievement terkait jumlah klik
    {
      id: 'ach_clicks_1',
      title: 'Pemula',
      description: 'Klik sebanyak 100 kali',
      type: AchievementType.TOTAL_CLICKS,
      target: 100,
      progress: 0,
      reward: 50,
      completed: false,
      claimed: false,
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: 'ach_clicks_2',
      title: 'Pekerja Keras',
      description: 'Klik sebanyak 1,000 kali',
      type: AchievementType.TOTAL_CLICKS,
      target: 1000,
      progress: 0,
      reward: 200,
      completed: false,
      claimed: false,
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: 'ach_clicks_3',
      title: 'Klik Maniak',
      description: 'Klik sebanyak 10,000 kali',
      type: AchievementType.TOTAL_CLICKS,
      target: 10000,
      progress: 0,
      reward: 1000,
      completed: false,
      claimed: false,
      imageUrl: 'https://via.placeholder.com/50',
    },
    
    // Achievement terkait uang yang didapat
    {
      id: 'ach_money_1',
      title: 'Uang Pertama',
      description: 'Dapatkan total 1,000 uang',
      type: AchievementType.TOTAL_MONEY_EARNED,
      target: 1000,
      progress: 0,
      reward: 100,
      completed: false,
      claimed: false,
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: 'ach_money_2',
      title: 'Pengusaha Kecil',
      description: 'Dapatkan total 10,000 uang',
      type: AchievementType.TOTAL_MONEY_EARNED,
      target: 10000,
      progress: 0,
      reward: 500,
      completed: false,
      claimed: false,
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: 'ach_money_3',
      title: 'Pengusaha Sukses',
      description: 'Dapatkan total 100,000 uang',
      type: AchievementType.TOTAL_MONEY_EARNED,
      target: 100000,
      progress: 0,
      reward: 2000,
      completed: false,
      claimed: false,
      imageUrl: 'https://via.placeholder.com/50',
    },
    
    // Achievement terkait upgrade
    {
      id: 'ach_upgrades_1',
      title: 'Perbaiki Bisnis',
      description: 'Beli 5 upgrade',
      type: AchievementType.TOTAL_UPGRADES,
      target: 5,
      progress: 0,
      reward: 200,
      completed: false,
      claimed: false,
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: 'ach_upgrades_2',
      title: 'Bisnismen',
      description: 'Beli 20 upgrade',
      type: AchievementType.TOTAL_UPGRADES,
      target: 20,
      progress: 0,
      reward: 1000,
      completed: false,
      claimed: false,
      imageUrl: 'https://via.placeholder.com/50',
    },
  ];
} 