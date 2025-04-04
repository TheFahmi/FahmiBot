// Definisi untuk karakter
export interface Character {
  id: string;
  name: string;
  description: string;
  cost: number;
  clickMultiplier: number;
  autoClickerMultiplier: number;
  imageUrl?: string;
  owned: boolean;
  unlocked: boolean;
}

// Daftar karakter default
export const CHARACTERS: Character[] = [
  {
    id: 'char_1',
    name: 'Pemula',
    description: 'Karakter awal, tidak ada bonus khusus',
    cost: 0,
    clickMultiplier: 1,
    autoClickerMultiplier: 1,
    imageUrl: 'https://via.placeholder.com/100',
    owned: true,
    unlocked: true,
  },
  {
    id: 'char_2',
    name: 'Investor Muda',
    description: 'Meningkatkan pendapatan per klik sebesar 15%',
    cost: 5000,
    clickMultiplier: 1.15,
    autoClickerMultiplier: 1,
    imageUrl: 'https://via.placeholder.com/100',
    owned: false,
    unlocked: false,
  },
  {
    id: 'char_3',
    name: 'Manajer',
    description: 'Meningkatkan pendapatan pasif sebesar 15%',
    cost: 10000,
    clickMultiplier: 1,
    autoClickerMultiplier: 1.15,
    imageUrl: 'https://via.placeholder.com/100',
    owned: false,
    unlocked: false,
  },
  {
    id: 'char_4',
    name: 'Pengusaha',
    description: 'Meningkatkan semua pendapatan sebesar 10%',
    cost: 25000,
    clickMultiplier: 1.1,
    autoClickerMultiplier: 1.1,
    imageUrl: 'https://via.placeholder.com/100',
    owned: false,
    unlocked: false,
  },
  {
    id: 'char_5',
    name: 'CEO',
    description: 'Meningkatkan semua pendapatan sebesar 20%',
    cost: 100000,
]; 