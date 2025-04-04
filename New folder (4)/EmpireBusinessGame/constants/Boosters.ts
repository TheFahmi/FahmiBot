// Definisi untuk booster
export interface Booster {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number; // Durasi dalam milidetik
  multiplier: number;
  cooldown: number; // Cooldown dalam milidetik
  imageUrl?: string;
  owned: boolean;
}

// Booster yang sedang aktif
export interface ActiveBooster {
  id: string;
  multiplier: number;
  endTime: number; // Timestamp berakhirnya booster
}

// Booster dengan tambahan info cooldown
export interface BoosterWithCooldown extends Booster {
  onCooldown: boolean;
  cooldownEndTime?: number;
}

// Daftar booster default
export const BOOSTERS: Booster[] = [
  {
    id: 'booster_1',
    name: 'Kopi',
    description: 'Tingkatkan produktivitas 2x selama 1 menit',
    cost: 100,
    duration: 60 * 1000, // 1 menit dalam milidetik
    multiplier: 2,
    cooldown: 2 * 60 * 1000, // 2 menit cooldown
    imageUrl: 'https://via.placeholder.com/50',
    owned: true,
  },
  {
    id: 'booster_2',
    name: 'Rapat Tim',
    description: 'Tingkatkan produktivitas 3x selama 2 menit',
    cost: 500,
    duration: 2 * 60 * 1000, // 2 menit
    multiplier: 3,
    cooldown: 5 * 60 * 1000, // 5 menit cooldown
    imageUrl: 'https://via.placeholder.com/50',
    owned: false,
  },
  {
    id: 'booster_3',
    name: 'Konsultan',
    description: 'Tingkatkan produktivitas 5x selama 5 menit',
    cost: 2000,
    duration: 5 * 60 * 1000, // 5 menit
    multiplier: 5,
    cooldown: 15 * 60 * 1000, // 15 menit cooldown
    imageUrl: 'https://via.placeholder.com/50',
    owned: false,
  },
];

// Fungsi untuk menghitung total multiplier dari semua booster aktif
export function calculateTotalMultiplier(activeBoosters: ActiveBooster[]): number {
  if (!activeBoosters || activeBoosters.length === 0) {
    return 1; // Default multiplier jika tidak ada booster aktif
  }
  
  // Hitung total multiplier dari semua booster aktif
  const totalMultiplier = activeBoosters.reduce((total, booster) => {
    // Periksa jika booster masih aktif
    if (booster.endTime > Date.now()) {
      return total * booster.multiplier;
    }
    return total;
  }, 1);
  
  return totalMultiplier;
}

// Fungsi untuk menghitung multiplier untuk auto clicker
export function calculateAutoClickMultiplier(activeBoosters: ActiveBooster[]): number {
  // Bisa disesuaikan jika auto-clicker menggunakan perhitungan multiplier yang berbeda
  return calculateTotalMultiplier(activeBoosters);
} 