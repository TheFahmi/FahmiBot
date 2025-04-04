import { BusinessInterface } from '../contexts/GameContext';

// Data bisnis awal dengan harga yang lebih tinggi dan pendapatan yang lebih rendah
const initialBusinesses: Record<string, BusinessInterface> = {
  lemonade: {
    id: 'lemonade',
    name: 'Kedai Limun',
    description: 'Kedai limun sederhana yang menyegarkan di hari panas',
    basePrice: 10, // Dinaikkan dari 4
    level: 0,
    baseIncomePerSecond: 0.5, // Diturunkan dari 1
    icon: 'cup',
    owned: false,
    lastCollected: Date.now()
  },
  
  newspaper: {
    id: 'newspaper',
    name: 'Kios Koran',
    description: 'Kios koran yang menyediakan berita harian terbaru',
    basePrice: 150, // Dinaikkan dari 60
    level: 0,
    baseIncomePerSecond: 3, // Diturunkan dari 6
    icon: 'newspaper',
    owned: false,
    lastCollected: Date.now()
  },
  
  carwash: {
    id: 'carwash',
    name: 'Cuci Mobil',
    description: 'Tempat cuci mobil otomatis dengan layanan cepat',
    basePrice: 1500, // Dinaikkan dari 720
    level: 0,
    baseIncomePerSecond: 20, // Diturunkan dari 40
    icon: 'car-wash',
    owned: false,
    lastCollected: Date.now()
  },
  
  pizzeria: {
    id: 'pizzeria',
    name: 'Pizzeria',
    description: 'Restoran pizza Italia dengan resep rahasia keluarga',
    basePrice: 15000, // Dinaikkan dari 8640
    level: 0,
    baseIncomePerSecond: 100, // Diturunkan dari 220
    icon: 'pizza',
    owned: false,
    lastCollected: Date.now()
  },
  
  donutshop: {
    id: 'donutshop',
    name: 'Toko Donat',
    description: 'Toko donat dengan berbagai pilihan topping dan rasa',
    basePrice: 200000, // Dinaikkan dari 103680
    level: 0,
    baseIncomePerSecond: 600, // Diturunkan dari 1200
    icon: 'food-donut',
    owned: false,
    lastCollected: Date.now()
  },
  
  salon: {
    id: 'salon',
    name: 'Salon Kecantikan',
    description: 'Salon kecantikan dan spa dengan berbagai perawatan premium',
    basePrice: 2500000, // Dinaikkan dari 1244160
    level: 0,
    baseIncomePerSecond: 3000, // Diturunkan dari 6500
    icon: 'content-cut',
    owned: false,
    lastCollected: Date.now()
  },
  
  minimarket: {
    id: 'minimarket',
    name: 'Mini Market',
    description: 'Mini market 24 jam dengan berbagai kebutuhan sehari-hari',
    basePrice: 30000000, // Dinaikkan dari 14929920
    level: 0,
    baseIncomePerSecond: 15000, // Diturunkan dari 35000
    icon: 'store',
    owned: false,
    lastCollected: Date.now()
  },
  
  movietheater: {
    id: 'movietheater',
    name: 'Bioskop',
    description: 'Bioskop modern dengan teknologi suara dan gambar terbaru',
    basePrice: 350000000, // Dinaikkan dari 179159040
    level: 0,
    baseIncomePerSecond: 80000, // Diturunkan dari 175000
    icon: 'movie',
    owned: false,
    lastCollected: Date.now()
  },
  
  bank: {
    id: 'bank',
    name: 'Bank',
    description: 'Bank dengan berbagai layanan keuangan dan investasi',
    basePrice: 4000000000, // Dinaikkan dari 2149908480
    level: 0,
    baseIncomePerSecond: 400000, // Diturunkan dari 900000
    icon: 'bank',
    owned: false,
    lastCollected: Date.now()
  },
  
  oilcompany: {
    id: 'oilcompany',
    name: 'Perusahaan Minyak',
    description: 'Perusahaan minyak multinasional dengan sumur minyak di berbagai negara',
    basePrice: 50000000000, // Dinaikkan dari 25798901760
    level: 0,
    baseIncomePerSecond: 2000000, // Diturunkan dari 5000000
    icon: 'oil',
    owned: false,
    lastCollected: Date.now()
  },
};

export default initialBusinesses; 