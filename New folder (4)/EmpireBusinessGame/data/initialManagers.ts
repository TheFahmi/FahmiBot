import { ImageSourcePropType } from 'react-native';

export interface Manager {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  imagePath?: ImageSourcePropType;
  unlocked: boolean;
  businessName: string;
}

// Data manager awal
const initialManagers: Record<string, Manager> = {
  lemonadeManager: {
    id: 'lemonadeManager',
    businessId: 'lemonade',
    name: 'Budi',
    description: 'Mahasiswa paruh waktu yang rajin mengelola kedai limun Anda',
    price: 100,
    icon: 'account-tie',
    imagePath: require('../assets/images/managers/lemonade_manager.jpg'),
    unlocked: false,
    businessName: 'Kedai Limun',
  },
  
  newspaperManager: {
    id: 'newspaperManager',
    businessId: 'newspaper',
    name: 'Siti',
    description: 'Pensiunan jurnalis yang ahli dalam distribusi koran',
    price: 500,
    icon: 'account-tie',
    imagePath: require('../assets/images/managers/newspaper_manager.jpg'),
    unlocked: false,
    businessName: 'Kios Koran',
  },
  
  carwashManager: {
    id: 'carwashManager',
    businessId: 'carwash',
    name: 'Anto',
    description: 'Mantan montir yang sangat teliti dalam kebersihan kendaraan',
    price: 4000,
    icon: 'account-tie',
    imagePath: require('../assets/images/managers/carwash_manager.jpg'),
    unlocked: false,
    businessName: 'Cuci Mobil',
  },
  
  pizzeriaManager: {
    id: 'pizzeriaManager',
    businessId: 'pizzeria',
    name: 'Giovanni',
    description: 'Koki asal Italia dengan pengalaman 15 tahun membuat pizza',
    price: 25000,
    icon: 'account-tie',
    imagePath: require('../assets/images/managers/pizzeria_manager.jpg'),
    unlocked: false,
    businessName: 'Pizzeria',
  },
  
  donutshopManager: {
    id: 'donutshopManager',
    businessId: 'donutshop',
    name: 'Dewi',
    description: 'Ahli kue dengan sertifikat patisserie dari Perancis',
    price: 150000,
    icon: 'account-tie',
    imagePath: require('../assets/images/managers/donutshop_manager.jpg'),
    unlocked: false,
    businessName: 'Toko Donat',
  },
  
  salonManager: {
    id: 'salonManager',
    businessId: 'salon',
    name: 'Linda',
    description: 'Stylist profesional dengan pengalaman di salon selebriti',
    price: 900000,
    icon: 'account-tie',
    imagePath: require('../assets/images/managers/salon_manager.jpg'),
    unlocked: false,
    businessName: 'Salon Kecantikan',
  },
  
  minimarketManager: {
    id: 'minimarketManager',
    businessId: 'minimarket',
    name: 'Adi',
    description: 'Mantan supervisor minimarket ternama dengan 10 tahun pengalaman',
    price: 5000000,
    icon: 'account-tie',
    imagePath: require('../assets/images/managers/minimarket_manager.jpg'),
    unlocked: false,
    businessName: 'Mini Market',
  },
  
  movietheaterManager: {
    id: 'movietheaterManager',
    businessId: 'movietheater',
    name: 'Rudi',
    description: 'Sutradara film indie yang memiliki pengetahuan luas tentang perfilman',
    price: 25000000,
    icon: 'account-tie',
    imagePath: require('../assets/images/managers/movietheater_manager.jpg'),
    unlocked: false,
    businessName: 'Bioskop',
  },
  
  bankManager: {
    id: 'bankManager',
    businessId: 'bank',
    name: 'Irawan',
    description: 'Mantan direktur bank swasta dengan pengalaman internasional',
    price: 125000000,
    icon: 'account-tie',
    imagePath: require('../assets/images/managers/bank_manager.jpg'),
    unlocked: false,
    businessName: 'Bank',
  },
  
  oilcompanyManager: {
    id: 'oilcompanyManager',
    businessId: 'oilcompany',
    name: 'Hartono',
    description: 'Insinyur perminyakan berpengalaman dengan jaringan global',
    price: 750000000,
    icon: 'account-tie',
    imagePath: require('../assets/images/managers/oilcompany_manager.jpg'),
    unlocked: false,
    businessName: 'Perusahaan Minyak',
  },
};

export default initialManagers; 