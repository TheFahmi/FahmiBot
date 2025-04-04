import { Business } from '../contexts/GameContext';

// Data bisnis awal
const initialBusinesses: Record<string, Business> = {
  lemonade: {
    id: 'lemonade',
    name: 'Kedai Limun',
    description: 'Kedai limun sederhana yang menyegarkan di hari panas',
    baseIncome: 1,
    basePrice: 4,
    icon: 'cup',
    imagePath: require('../assets/images/businesses/lemonade.jpg'),
    unlocked: false,
    level: 0,
    managerUnlocked: false,
    managerPrice: 100,
    cooldown: 3, // 3 detik
  },
  
  newspaper: {
    id: 'newspaper',
    name: 'Kios Koran',
    description: 'Kios koran yang menyediakan berita harian terbaru',
    baseIncome: 6,
    basePrice: 60,
    icon: 'newspaper',
    imagePath: require('../assets/images/businesses/newspaper.jpg'),
    unlocked: false,
    level: 0,
    managerUnlocked: false,
    managerPrice: 500,
    cooldown: 6, // 6 detik
  },
  
  carwash: {
    id: 'carwash',
    name: 'Cuci Mobil',
    description: 'Tempat cuci mobil otomatis dengan layanan cepat',
    baseIncome: 40,
    basePrice: 720,
    icon: 'car-wash',
    imagePath: require('../assets/images/businesses/carwash.jpg'),
    unlocked: false,
    level: 0,
    managerUnlocked: false,
    managerPrice: 4000,
    cooldown: 10, // 10 detik
  },
  
  pizzeria: {
    id: 'pizzeria',
    name: 'Pizzeria',
    description: 'Restoran pizza Italia dengan resep rahasia keluarga',
    baseIncome: 220,
    basePrice: 8640,
    icon: 'pizza',
    imagePath: require('../assets/images/businesses/pizzeria.jpg'),
    unlocked: false,
    level: 0,
    managerUnlocked: false,
    managerPrice: 25000,
    cooldown: 15, // 15 detik
  },
  
  donutshop: {
    id: 'donutshop',
    name: 'Toko Donat',
    description: 'Toko donat dengan berbagai pilihan topping dan rasa',
    baseIncome: 1200,
    basePrice: 103680,
    icon: 'food-donut',
    imagePath: require('../assets/images/businesses/donutshop.jpg'),
    unlocked: false,
    level: 0,
    managerUnlocked: false,
    managerPrice: 150000,
    cooldown: 20, // 20 detik
  },
  
  salon: {
    id: 'salon',
    name: 'Salon Kecantikan',
    description: 'Salon kecantikan dan spa dengan berbagai perawatan premium',
    baseIncome: 6500,
    basePrice: 1244160,
    icon: 'content-cut',
    imagePath: require('../assets/images/businesses/salon.jpg'),
    unlocked: false,
    level: 0,
    managerUnlocked: false,
    managerPrice: 900000,
    cooldown: 30, // 30 detik
  },
  
  minimarket: {
    id: 'minimarket',
    name: 'Mini Market',
    description: 'Mini market 24 jam dengan berbagai kebutuhan sehari-hari',
    baseIncome: 35000,
    basePrice: 14929920,
    icon: 'store',
    imagePath: require('../assets/images/businesses/minimarket.jpg'),
    unlocked: false,
    level: 0,
    managerUnlocked: false,
    managerPrice: 5000000,
    cooldown: 45, // 45 detik
  },
  
  movietheater: {
    id: 'movietheater',
    name: 'Bioskop',
    description: 'Bioskop modern dengan teknologi suara dan gambar terbaru',
    baseIncome: 175000,
    basePrice: 179159040,
    icon: 'movie',
    imagePath: require('../assets/images/businesses/movietheater.jpg'),
    unlocked: false,
    level: 0,
    managerUnlocked: false,
    managerPrice: 25000000,
    cooldown: 60, // 60 detik
  },
  
  bank: {
    id: 'bank',
    name: 'Bank',
    description: 'Bank dengan berbagai layanan keuangan dan investasi',
    baseIncome: 900000,
    basePrice: 2149908480,
    icon: 'bank',
    imagePath: require('../assets/images/businesses/bank.jpg'),
    unlocked: false,
    level: 0,
    managerUnlocked: false,
    managerPrice: 125000000,
    cooldown: 90, // 90 detik
  },
  
  oilcompany: {
    id: 'oilcompany',
    name: 'Perusahaan Minyak',
    description: 'Perusahaan minyak multinasional dengan sumur minyak di berbagai negara',
    baseIncome: 5000000,
    basePrice: 25798901760,
    icon: 'oil',
    imagePath: require('../assets/images/businesses/oilcompany.jpg'),
    unlocked: false,
    level: 0,
    managerUnlocked: false,
    managerPrice: 750000000,
    cooldown: 120, // 120 detik
  },
};

export default initialBusinesses; 