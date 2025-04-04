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
    description: 'Karakter default tanpa bonus khusus',
    cost: 0,
    clickMultiplier: 1,
    autoClickerMultiplier: 1,
    imageUrl: 'https://via.placeholder.com/100',
    owned: true,
    unlocked: true,
  },
  {
    id: 'char_2',
    name: 'Pengusaha',
    description: 'Meningkatkan pendapatan klik sebesar 50%',
    cost: 500,
    clickMultiplier: 1.5,
    autoClickerMultiplier: 1,
    imageUrl: 'https://via.placeholder.com/100',
    owned: false,
    unlocked: true,
  },
  {
    id: 'char_3',
    name: 'CEO',
    description: 'Meningkatkan pendapatan auto-clicker sebesar 50%',
    cost: 1000,
    clickMultiplier: 1,
    autoClickerMultiplier: 1.5,
    imageUrl: 'https://via.placeholder.com/100',
    owned: false,
    unlocked: true,
  },
  {
    id: 'char_4',
    name: 'Konglomerat',
    description: 'Meningkatkan semua pendapatan sebesar 25%',
    cost: 5000,
    clickMultiplier: 1.25,
    autoClickerMultiplier: 1.25,
    imageUrl: 'https://via.placeholder.com/100',
    owned: false,
    unlocked: false,
  },
]; 