import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  showSuccessNotification, 
  showInfoNotification,
  showWarningNotification
} from '../utils/notifications';
import formatMoney from '../utils/formatMoney';

// Interfaces dan Types
export interface UpgradeInterface {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  level: number;
  moneyPerClickBonus: number;
  icon: string;
}

export interface BusinessInterface {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  level: number;
  baseIncomePerSecond: number;
  icon: string;
  owned: boolean;
  lastCollected: number;
}

export interface GameStats {
  startTime: number;
  playTime: number;
  totalClicks: number;
  totalUpgradesBought: number;
  totalBusinessesBought: number;
  highestMoneyPerClick: number;
  highestMoneyPerSecond: number;
  totalMoneyFromClicks: number;
  totalMoneyFromBusinesses: number;
}

export interface GameState {
  money: number;
  moneyPerClick: number;
  moneyPerSecond: number;
  totalMoney: number;
  totalMoneySpent: number;
  totalClicks: number;
  lastSaveTime: number;
  upgrades: UpgradeInterface[];
  businesses: BusinessInterface[];
  stats: GameStats;
}

// Actions
type Action =
  | { type: 'ADD_MONEY'; payload: number; source?: 'click' | 'business' }
  | { type: 'RESET_GAME' }
  | { type: 'BUY_UPGRADE'; payload: string }
  | { type: 'BUY_BUSINESS'; payload: string }
  | { type: 'COLLECT_BUSINESS_INCOME'; payload: string }
  | { type: 'ADD_PASSIVE_INCOME' }
  | { type: 'COLLECT_OFFLINE_EARNINGS' }
  | { type: 'UPDATE_PLAYTIME'; payload: number }
  | { type: 'LOAD_GAME'; payload: GameState };

// Konstanta
const STORAGE_KEY = 'empire_business_game_data';
const AUTO_SAVE_INTERVAL = 10000; // 10 detik
const PASSIVE_INCOME_INTERVAL = 1000; // 1 detik

// Initial State
const initialUpgrades: UpgradeInterface[] = [
  {
    id: 'upgrade1',
    name: 'Klik Lebih Baik',
    description: 'Meningkatkan uang per klik sebesar 0.5',
    basePrice: 20,
    level: 0,
    moneyPerClickBonus: 0.5,
    icon: 'cursor-default-click',
  },
  {
    id: 'upgrade2',
    name: 'Klik Super',
    description: 'Meningkatkan uang per klik sebesar 2',
    basePrice: 100,
    level: 0,
    moneyPerClickBonus: 2,
    icon: 'cursor-default-click-outline',
  },
  {
    id: 'upgrade3',
    name: 'Klik Luar Biasa',
    description: 'Meningkatkan uang per klik sebesar 5',
    basePrice: 500,
    level: 0,
    moneyPerClickBonus: 5,
    icon: 'hand-extended',
  },
  {
    id: 'upgrade4',
    name: 'Klik Raja',
    description: 'Meningkatkan uang per klik sebesar 25',
    basePrice: 2500,
    level: 0,
    moneyPerClickBonus: 25,
    icon: 'crown',
  },
  {
    id: 'upgrade5',
    name: 'Klik Jutawan',
    description: 'Meningkatkan uang per klik sebesar 50',
    basePrice: 10000,
    level: 0,
    moneyPerClickBonus: 50,
    icon: 'diamond',
  },
];

const initialBusinesses: BusinessInterface[] = [
  {
    id: 'business1',
    name: 'Kedai Limonade',
    description: 'Bikin limonade segar',
    basePrice: 100,
    level: 0,
    baseIncomePerSecond: 1,
    icon: 'cup',
    owned: false,
    lastCollected: Date.now(),
  },
  {
    id: 'business2',
    name: 'Warung Makan',
    description: 'Jual makanan enak',
    basePrice: 500,
    level: 0,
    baseIncomePerSecond: 5,
    icon: 'food',
    owned: false,
    lastCollected: Date.now(),
  },
  {
    id: 'business3',
    name: 'Toko Sepatu',
    description: 'Jual sepatu branded',
    basePrice: 2000,
    level: 0,
    baseIncomePerSecond: 20,
    icon: 'shoe-formal',
    owned: false,
    lastCollected: Date.now(),
  },
  {
    id: 'business4',
    name: 'Salon Kecantikan',
    description: 'Buat orang lebih cantik',
    basePrice: 10000,
    level: 0,
    baseIncomePerSecond: 100,
    icon: 'face-woman',
    owned: false,
    lastCollected: Date.now(),
  },
  {
    id: 'business5',
    name: 'Supermarket',
    description: 'Jual kebutuhan sehari-hari',
    basePrice: 50000,
    level: 0,
    baseIncomePerSecond: 500,
    icon: 'cart',
    owned: false,
    lastCollected: Date.now(),
  },
];

const initialStats: GameStats = {
  startTime: Date.now(),
  playTime: 0,
  totalClicks: 0,
  totalUpgradesBought: 0,
  totalBusinessesBought: 0,
  highestMoneyPerClick: 1,
  highestMoneyPerSecond: 0,
  totalMoneyFromClicks: 0,
  totalMoneyFromBusinesses: 0,
};

const initialState: GameState = {
  money: 0,
  moneyPerClick: 0.5,
  moneyPerSecond: 0,
  totalMoney: 0,
  totalMoneySpent: 0,
  totalClicks: 0,
  lastSaveTime: Date.now(),
  upgrades: initialUpgrades,
  businesses: initialBusinesses,
  stats: initialStats,
};

// Reducer
const calculateUpgradePrice = (basePrice: number, level: number): number => {
  // Menggunakan kenaikan persentase tetap bukannya eksponen
  const incrementFactor = 25; // 25% kenaikan per level
  let finalPrice = basePrice;
  
  for (let i = 0; i < level; i++) {
    finalPrice += Math.floor(finalPrice * incrementFactor / 100);
  }
  
  return Math.floor(finalPrice);
};

const calculateBusinessPrice = (basePrice: number, level: number): number => {
  // Menggunakan kenaikan persentase tetap bukannya eksponen
  const incrementFactor = 35; // 35% kenaikan per level
  let finalPrice = basePrice;
  
  for (let i = 0; i < level; i++) {
    finalPrice += Math.floor(finalPrice * incrementFactor / 100);
  }
  
  return Math.floor(finalPrice);
};

const calculateBusinessIncome = (
  baseIncomePerSecond: number,
  level: number
): number => {
  // Menggunakan kenaikan persentase tetap bukannya eksponen
  const incrementFactor = 15; // 15% kenaikan per level
  let finalIncome = baseIncomePerSecond;
  
  for (let i = 0; i < level; i++) {
    finalIncome += Math.floor(finalIncome * incrementFactor / 100);
  }
  
  return Math.floor(finalIncome);
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'ADD_MONEY': {
      const source = action.source || 'click';
      const newMoney = state.money + action.payload;
      const newTotalMoney = state.totalMoney + action.payload;
      
      // Update statistik berdasarkan sumber pendapatan
      const newStats = { ...state.stats };
      if (source === 'click') {
        newStats.totalMoneyFromClicks += action.payload;
      } else if (source === 'business') {
        newStats.totalMoneyFromBusinesses += action.payload;
      }
      
      return {
        ...state,
        money: newMoney,
        totalMoney: newTotalMoney,
        stats: {
          ...newStats,
          highestMoneyPerClick: Math.max(newStats.highestMoneyPerClick, state.moneyPerClick),
          highestMoneyPerSecond: Math.max(newStats.highestMoneyPerSecond, state.moneyPerSecond),
        },
      };
    }
    
    case 'BUY_UPGRADE': {
      const upgradeIndex = state.upgrades.findIndex(
        (upgrade) => upgrade.id === action.payload
      );
      
      if (upgradeIndex === -1) return state;
      
      const upgrade = state.upgrades[upgradeIndex];
      const price = calculateUpgradePrice(upgrade.basePrice, upgrade.level);
      
      if (state.money < price) {
        showWarningNotification(
          'Uang tidak cukup untuk membeli upgrade!', 
          'cash-remove', 
          2000
        );
        return state;
      }
      
      const newUpgrades = [...state.upgrades];
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        level: upgrade.level + 1,
      };
      
      const newMoneyPerClick =
        state.moneyPerClick + upgrade.moneyPerClickBonus;

      // Tampilkan notifikasi sukses
      showSuccessNotification(
        `Upgrade ${upgrade.name} dibeli!`,
        'check-circle',
        2000
      );
      
      return {
        ...state,
        money: state.money - price,
        moneyPerClick: newMoneyPerClick,
        totalMoneySpent: state.totalMoneySpent + price,
        upgrades: newUpgrades,
        stats: {
          ...state.stats,
          totalUpgradesBought: state.stats.totalUpgradesBought + 1,
          highestMoneyPerClick: Math.max(state.stats.highestMoneyPerClick, newMoneyPerClick),
        },
      };
    }
    
    case 'BUY_BUSINESS': {
      const businessIndex = state.businesses.findIndex(
        (business) => business.id === action.payload
      );
      
      if (businessIndex === -1) return state;
      
      const business = state.businesses[businessIndex];
      const price = business.owned
        ? calculateBusinessPrice(business.basePrice, business.level)
        : business.basePrice;
      
      if (state.money < price) {
        showWarningNotification(
          'Uang tidak cukup untuk membeli bisnis!', 
          'cash-remove', 
          2000
        );
        return state;
      }
      
      const newBusinesses = [...state.businesses];
      const newLevel = business.owned ? business.level + 1 : 1;
      newBusinesses[businessIndex] = {
        ...business,
        level: newLevel,
        owned: true,
        lastCollected: Date.now(),
      };
      
      const newMoneyPerSecond = state.businesses.reduce((total, currentBusiness) => {
        if (currentBusiness.id === business.id) {
          return (
            total +
            (currentBusiness.owned
              ? calculateBusinessIncome(currentBusiness.baseIncomePerSecond, currentBusiness.level)
              : 0) +
            calculateBusinessIncome(business.baseIncomePerSecond, newLevel)
          );
        }
        return (
          total +
          (currentBusiness.owned
            ? calculateBusinessIncome(currentBusiness.baseIncomePerSecond, currentBusiness.level)
            : 0)
        );
      }, 0);

      // Tampilkan notifikasi sukses
      const isNewBusiness = !business.owned;
      showSuccessNotification(
        isNewBusiness 
          ? `Bisnis baru: ${business.name} dibeli!` 
          : `${business.name} ditingkatkan ke level ${newLevel}!`,
        isNewBusiness ? 'store' : 'trending-up',
        2000
      );
      
      return {
        ...state,
        money: state.money - price,
        moneyPerSecond: newMoneyPerSecond,
        totalMoneySpent: state.totalMoneySpent + price,
        businesses: newBusinesses,
        stats: {
          ...state.stats,
          totalBusinessesBought: state.stats.totalBusinessesBought + 1,
          highestMoneyPerSecond: Math.max(state.stats.highestMoneyPerSecond, newMoneyPerSecond),
        },
      };
    }
    
    case 'COLLECT_BUSINESS_INCOME': {
      const businessIndex = state.businesses.findIndex(
        (business) => business.id === action.payload
      );
      
      if (businessIndex === -1 || !state.businesses[businessIndex].owned) {
        return state;
      }
      
      const business = state.businesses[businessIndex];
      const currentTime = Date.now();
      const timeDiff = (currentTime - business.lastCollected) / 1000; // dalam detik
      const income = calculateBusinessIncome(
        business.baseIncomePerSecond,
        business.level
      ) * timeDiff;
      
      if (income <= 0) {
        return state;
      }
      
      const newBusinesses = [...state.businesses];
      newBusinesses[businessIndex] = {
        ...business,
        lastCollected: currentTime,
      };
      
      // Tampilkan notifikasi informasi
      showInfoNotification(
        `Uang $${Math.floor(income)} dikumpulkan dari ${business.name}!`,
        'cash-plus',
        2000
      );
      
      return {
        ...state,
        money: state.money + income,
        totalMoney: state.totalMoney + income,
        businesses: newBusinesses,
        stats: {
          ...state.stats,
          totalMoneyFromBusinesses: state.stats.totalMoneyFromBusinesses + income,
        },
      };
    }
    
    case 'ADD_PASSIVE_INCOME': {
      // Hitung pendapatan dari semua bisnis
      let totalIncome = 0;
      const newBusinesses = state.businesses.map((business) => {
        if (!business.owned) return business;
        
        const currentTime = Date.now();
        const timeDiff = (currentTime - business.lastCollected) / 1000; // dalam detik
        const income = calculateBusinessIncome(
          business.baseIncomePerSecond,
          business.level
        ) * timeDiff;
        
        totalIncome += income;
        
        return {
          ...business,
          lastCollected: currentTime,
        };
      });
      
      if (totalIncome <= 0) {
        return state;
      }
      
      return {
        ...state,
        money: state.money + totalIncome,
        totalMoney: state.totalMoney + totalIncome,
        businesses: newBusinesses,
        stats: {
          ...state.stats,
          totalMoneyFromBusinesses: state.stats.totalMoneyFromBusinesses + totalIncome,
        },
      };
    }
    
    case 'COLLECT_OFFLINE_EARNINGS': {
      const currentTime = Date.now();
      const offlineTime = (currentTime - state.lastSaveTime) / 1000; // dalam detik
      
      if (offlineTime <= 0 || state.moneyPerSecond <= 0) {
        return { ...state, lastSaveTime: currentTime };
      }
      
      // Batasi waktu offline maksimum (8 jam - lebih sedikit dari 24 jam sebelumnya)
      const cappedOfflineTime = Math.min(offlineTime, 8 * 60 * 60);
      
      // Hitung pendapatan offline (40% dari pendapatan normal - dikurangi dari 80%)
      const offlineEarnings = state.moneyPerSecond * cappedOfflineTime * 0.4;
      const roundedEarnings = Math.floor(offlineEarnings);
      
      if (roundedEarnings > 0) {
        showInfoNotification(
          `Anda mendapatkan ${formatMoney(roundedEarnings)} saat offline!`,
          'clock-time-eight',
          5000
        );
      }
      
      return {
        ...state,
        money: state.money + roundedEarnings,
        totalMoney: state.totalMoney + roundedEarnings,
        lastSaveTime: currentTime,
        stats: {
          ...state.stats,
          totalMoneyFromBusinesses: state.stats.totalMoneyFromBusinesses + roundedEarnings,
        },
      };
    }
    
    case 'UPDATE_PLAYTIME': {
      return {
        ...state,
        stats: {
          ...state.stats,
          playTime: state.stats.playTime + action.payload,
        },
      };
    }
    
    case 'RESET_GAME': {
      const newStats = {
        ...initialStats,
        startTime: Date.now(),
      };
      
      return {
        ...initialState,
        stats: newStats,
        lastSaveTime: Date.now(),
      };
    }
    
    case 'LOAD_GAME': {
      return action.payload;
    }
    
    default:
      return state;
  }
};

// Context
interface GameContextValue {
  state: GameState;
  addMoney: (amount: number, source?: 'click' | 'business') => void;
  resetGame: () => void;
  buyUpgrade: (upgradeId: string) => void;
  buyBusiness: (businessId: string) => void;
  collectBusinessIncome: (businessId: string) => void;
  saveGame: () => Promise<boolean>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

// Provider
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Fungsi untuk menyimpan game ke localStorage
  const saveGameData = async () => {
    try {
      const gameToSave = {
        ...state,
        lastSaveTime: Date.now(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gameToSave));
      console.log('Game berhasil disimpan!');
      return true;
    } catch (error) {
      console.error('Error menyimpan game:', error);
      return false;
    }
  };
  
  // Muat game dari penyimpanan lokal
  useEffect(() => {
    const loadGame = async () => {
      try {
        const savedGame = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedGame) {
          const parsedGame = JSON.parse(savedGame) as GameState;
          
          // Pastikan stats selalu ada
          parsedGame.stats = parsedGame.stats || { ...initialStats };
          
          dispatch({ type: 'LOAD_GAME', payload: parsedGame });
          
          // Kumpulkan pendapatan offline
          dispatch({ type: 'COLLECT_OFFLINE_EARNINGS' });
          
          console.log('Game berhasil dimuat dari localStorage!');
        }
      } catch (error) {
        console.error('Error loading game:', error);
      }
    };
    
    loadGame();
  }, []);
  
  // Simpan game secara otomatis
  useEffect(() => {
    const saveInterval = setInterval(async () => {
      await saveGameData();
    }, AUTO_SAVE_INTERVAL);
    
    return () => clearInterval(saveInterval);
  }, [state]);
  
  // Simpan game saat halaman akan ditutup
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGameData();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state]);
  
  // Timer untuk pendapatan pasif
  useEffect(() => {
    const passiveIncomeInterval = setInterval(() => {
      if (state.moneyPerSecond > 0) {
        dispatch({ type: 'ADD_PASSIVE_INCOME' });
      }
    }, PASSIVE_INCOME_INTERVAL);
    
    return () => clearInterval(passiveIncomeInterval);
  }, [state.moneyPerSecond]);
  
  // Timer untuk memperbarui waktu bermain
  useEffect(() => {
    const playtimeInterval = setInterval(() => {
      dispatch({ type: 'UPDATE_PLAYTIME', payload: 1 });
    }, 1000);
    
    return () => clearInterval(playtimeInterval);
  }, []);
  
  // Actions
  const addMoney = (amount: number, source?: 'click' | 'business') => {
    dispatch({ type: 'ADD_MONEY', payload: amount, source });
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
    saveGameData(); // Simpan status reset ke localStorage
  };
  
  const buyUpgrade = (upgradeId: string) => {
    dispatch({ type: 'BUY_UPGRADE', payload: upgradeId });
  };
  
  const buyBusiness = (businessId: string) => {
    dispatch({ type: 'BUY_BUSINESS', payload: businessId });
  };
  
  const collectBusinessIncome = (businessId: string) => {
    dispatch({ type: 'COLLECT_BUSINESS_INCOME', payload: businessId });
  };
  
  return (
    <GameContext.Provider
      value={{
        state,
        addMoney,
        resetGame,
        buyUpgrade,
        buyBusiness,
        collectBusinessIncome,
        saveGame: saveGameData, // Tambahkan fungsi untuk menyimpan game secara manual
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Hook
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    // Kembalikan default value alih-alih throw error
    console.warn('useGameContext must be used within a GameProvider');
    return {
      state: initialState,
      addMoney: () => {},
      resetGame: () => {},
      buyUpgrade: () => {},
      buyBusiness: () => {},
      collectBusinessIncome: () => {},
      saveGame: async () => true,
    };
  }
  return context;
}; 