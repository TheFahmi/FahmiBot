// Definisi untuk tema
export interface Theme {
  id: string;
  name: string;
  description: string;
  cost: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  imageUrl?: string;
  owned: boolean;
  unlocked: boolean;
}

// Daftar tema default
export const THEMES: Theme[] = [
  {
    id: 'theme_default',
    name: 'Dasar',
    description: 'Tema default dengan warna biru',
    cost: 0,
    primaryColor: '#2196F3',
    secondaryColor: '#4CAF50',
    accentColor: '#9C27B0',
    backgroundColor: '#F5F7FA',
    textColor: '#212121',
    imageUrl: 'https://via.placeholder.com/50',
    owned: true,
    unlocked: true,
  },
  {
    id: 'theme_dark',
    name: 'Mode Gelap',
    description: 'Tema gelap untuk mata yang lelah',
    cost: 200,
    primaryColor: '#3F51B5',
    secondaryColor: '#4CAF50',
    accentColor: '#FF9800',
    backgroundColor: '#121212',
    textColor: '#FFFFFF',
    imageUrl: 'https://via.placeholder.com/50',
    owned: false,
    unlocked: true,
  },
  {
    id: 'theme_neon',
    name: 'Neon',
    description: 'Tema terang dengan warna neon yang mencolok',
    cost: 500,
    primaryColor: '#FF00FF',
    secondaryColor: '#00FFFF',
    accentColor: '#FFFF00',
    backgroundColor: '#121212',
    textColor: '#FFFFFF',
    imageUrl: 'https://via.placeholder.com/50',
    owned: false,
    unlocked: false,
  },
]; 