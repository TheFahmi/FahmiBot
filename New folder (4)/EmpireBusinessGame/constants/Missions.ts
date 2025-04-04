// Tipe misi yang tersedia
export enum MissionType {
  CLICK_COUNT = 'CLICK_COUNT',
  MONEY_EARNED = 'MONEY_EARNED',
  UPGRADES_BOUGHT = 'UPGRADES_BOUGHT',
  TIME_PLAYED = 'TIME_PLAYED',
  AUTO_CLICKERS_BOUGHT = 'AUTO_CLICKERS_BOUGHT',
  TOTAL_MONEY = 'TOTAL_MONEY',
  LOGIN_STREAK = 'LOGIN_STREAK',
}

// Definisi untuk misi
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
  isDaily: boolean;
}

// Fungsi untuk mendapatkan semua misi
export function getAllMissions(): Mission[] {
  const mainMissions = [
    {
      id: 'mission_1',
      title: 'Pemula yang Tekun',
      description: 'Klik 50 kali',
      type: MissionType.CLICK_COUNT,
      target: 50,
      progress: 0,
      reward: 50,
      completed: false,
      claimed: false,
      isDaily: false,
    },
    {
      id: 'mission_2',
      title: 'Mencari Kekayaan',
      description: 'Dapatkan uang 100',
      type: MissionType.MONEY_EARNED,
      target: 100,
      progress: 0,
      reward: 20,
      completed: false,
      claimed: false,
      isDaily: false,
    },
    {
      id: 'mission_3',
      title: 'Pengusaha Muda',
      description: 'Beli 2 upgrade',
      type: MissionType.UPGRADES_BOUGHT,
      target: 2,
      progress: 0,
      reward: 100,
      completed: false,
      claimed: false,
      isDaily: false,
    },
    {
      id: 'mission_4',
      title: 'Dedikasi Bisnis',
      description: 'Mainkan selama 5 menit',
      type: MissionType.TIME_PLAYED,
      target: 5 * 60, // 5 menit dalam detik
      progress: 0,
      reward: 200,
      completed: false,
      claimed: false,
      isDaily: false,
    },
  ];
  
  return [...mainMissions, ...getDailyMissions()];
}

// Fungsi untuk mendapatkan misi harian
export function getDailyMissions(): Mission[] {
  return [
    {
      id: `daily_click_${Date.now()}`,
      title: 'Klik Harian',
      description: 'Klik 100 kali hari ini',
      type: MissionType.CLICK_COUNT,
      target: 100,
      progress: 0,
      reward: 50,
      completed: false,
      claimed: false,
      isDaily: true,
    },
    {
      id: `daily_money_${Date.now()}`,
      title: 'Uang Harian',
      description: 'Dapatkan uang 500 hari ini',
      type: MissionType.MONEY_EARNED,
      target: 500,
      progress: 0,
      reward: 100,
      completed: false,
      claimed: false,
      isDaily: true,
    },
  ];
} 