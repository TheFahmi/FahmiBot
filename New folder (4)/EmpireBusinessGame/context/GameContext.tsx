import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mission, getAllMissions, getDailyMissions } from '../constants/Missions';
import { AUTO_CLICKERS, AutoClicker } from '../constants/AutoClickers';
import { BOOSTERS, Booster as BoosterType, ActiveBooster, BoosterWithCooldown, calculateTotalMultiplier, calculateAutoClickMultiplier } from '../constants/Boosters';
import { CHARACTERS, Character } from '../constants/Characters';
import { THEMES, Theme } from '../constants/Themes';
import { Achievement, getAllAchievements } from '../constants/Achievements';

// Interface untuk definisi upgrade
interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  level: number;
  unlocked: boolean;
  imageUrl?: string;
}

// Interface untuk state game
interface GameState {
  money: number;
  moneyPerClick: number;
  totalClicks: number;
  totalMoneyEarned: number;
  totalUpgradesBought: number;
  upgrades: Upgrade[];
  missions: Mission[];
  lastDailyReset: number;
  
  // Fitur baru
  autoClickers: AutoClicker[];
  moneyPerSecond: number;
  activeBoosters: ActiveBooster[];
  boosterCooldowns: { [key: string]: number }; // ID booster => timestamp cooldown berakhir
  characters: Character[];
  activeCharacterId: string; // ID karakter yang dipilih
  themes: Theme[];
  activeThemeId: string; // ID tema yang dipilih
  stamina: number; // 0-100
  maxStamina: number; // Maksimum stamina (dapat ditingkatkan)
  lastStaminaUpdate: number; // Timestamp terakhir update stamina
  staminaRegenRate: number; // Regenerasi stamina per menit
  staminaBonusActive: boolean; // Apakah bonus stamina aktif
  staminaBonusEndTime: number; // Kapan bonus stamina berakhir
  
  // Statistik tambahan
  totalTimePlayed: number; // Waktu bermain dalam detik
  lastLoginDate: number; // Timestamp login terakhir
  loginStreak: number; // Streak login harian
  achievementsUnlocked: number; // Jumlah achievement yang sudah dibuka
  highestMoneyPerSecond: number; // Rekor tertinggi uang per detik
  
  // Achievement
  achievements: Achievement[];
  
  // Offline Earnings
  offlineEarnings: number; // Uang yang dihasilkan saat offline
  
  // Boosters collection
  boosters: BoosterType[];
}

// Interface untuk context
interface GameContextType {
  gameState: GameState;
  clickMoney: () => void;
  buyUpgrade: (upgradeId: string) => void;
  resetGame: () => void;
  claimMissionReward: (missionId: string) => void;
  
  // Fungsi untuk fitur baru
  buyAutoClicker: (autoClickerId: string) => void;
  activateBooster: (boosterId: string) => void;
  buyBooster: (boosterId: string) => void;
  buyCharacter: (characterId: string) => void;
  setActiveCharacter: (characterId: string) => void;
  buyTheme: (themeId: string) => void;
  setActiveTheme: (themeId: string) => void;
  useStamina: (amount: number) => boolean; // Mengembalikan false jika stamina tidak cukup
  activateStaminaBonus: (durationMinutes: number) => void;
  claimAchievementReward: (achievementId: string) => void;
  collectOfflineEarnings: (doubleReward?: boolean) => void;
}

// Nilai default untuk game
const DEFAULT_GAME_STATE: GameState = {
  money: 0,
  moneyPerClick: 1,
  totalClicks: 0,
  totalMoneyEarned: 0,
  totalUpgradesBought: 0,
  upgrades: [
    {
      id: 'upgrade1',
      name: 'Juru Ketik',
      description: 'Tambahkan juru ketik untuk meningkatkan produksi',
      cost: 10,
      multiplier: 1,
      level: 0,
      unlocked: true,
    },
    {
      id: 'upgrade2',
      name: 'Komputer Baru',
      description: 'Komputer yang lebih cepat meningkatkan efisiensi',
      cost: 50,
      multiplier: 5,
      level: 0,
      unlocked: true,
    },
    {
      id: 'upgrade3',
      name: 'Kantor Kecil',
      description: 'Sewa kantor kecil untuk operasi bisnis Anda',
      cost: 250,
      multiplier: 15,
      level: 0,
      unlocked: true,
    },
    {
      id: 'upgrade4',
      name: 'Tim Pemasaran',
      description: 'Tingkatkan penjualan dengan tim pemasaran',
      cost: 1000,
      multiplier: 50,
      level: 0,
      unlocked: false,
    },
    {
      id: 'upgrade5',
      name: 'Gedung Kantor',
      description: 'Bangun gedung perkantoran besar',
      cost: 5000,
      multiplier: 200,
      level: 0,
      unlocked: false,
    },
  ],
  missions: getAllMissions(),
  lastDailyReset: Date.now(),
  
  // Fitur baru
  autoClickers: AUTO_CLICKERS,
  moneyPerSecond: 0,
  activeBoosters: [],
  boosterCooldowns: {},
  characters: CHARACTERS,
  activeCharacterId: 'char_1', // Karakter default
  themes: THEMES,
  activeThemeId: 'theme_default', // Tema default
  stamina: 100,
  maxStamina: 100,
  lastStaminaUpdate: Date.now(),
  staminaRegenRate: 5, // 5 poin stamina per menit
  staminaBonusActive: false,
  staminaBonusEndTime: 0,
  
  // Statistik tambahan
  totalTimePlayed: 0,
  lastLoginDate: Date.now(),
  loginStreak: 1,
  achievementsUnlocked: 0,
  highestMoneyPerSecond: 0,
  
  // Achievement
  achievements: getAllAchievements(),
  
  // Offline Earnings
  offlineEarnings: 0,
  
  // Tambahkan koleksi boosters
  boosters: BOOSTERS,
};

// Membuat context
const GameContext = createContext<GameContextType | null>(null);

// Key untuk penyimpanan data
const STORAGE_KEY = 'empire_business_game_data';

// Provider Context
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);

  // Load data saat pertama kali aplikasi dibuka
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          let parsedData;
          try {
            parsedData = JSON.parse(savedData);
          } catch (parseError) {
            console.error('Error parsing saved data:', parseError);
            setGameState(DEFAULT_GAME_STATE);
            return;
          }
          
          // Validasi data dasar untuk menghindari error
          if (!parsedData || typeof parsedData !== 'object') {
            console.error('Saved data is not a valid object');
            setGameState(DEFAULT_GAME_STATE);
            return;
          }
          
          // Pastikan properti penting selalu ada
          parsedData.money = parsedData.money || 0;
          parsedData.moneyPerClick = parsedData.moneyPerClick || 1;
          parsedData.totalClicks = parsedData.totalClicks || 0;
          parsedData.totalMoneyEarned = parsedData.totalMoneyEarned || 0;
          parsedData.missions = Array.isArray(parsedData.missions) ? parsedData.missions : getAllMissions();
          parsedData.upgrades = Array.isArray(parsedData.upgrades) ? parsedData.upgrades : DEFAULT_GAME_STATE.upgrades;
          parsedData.activeBoosters = Array.isArray(parsedData.activeBoosters) ? parsedData.activeBoosters : [];
          parsedData.autoClickers = Array.isArray(parsedData.autoClickers) ? parsedData.autoClickers : AUTO_CLICKERS;
          parsedData.characters = Array.isArray(parsedData.characters) ? parsedData.characters : CHARACTERS;
          parsedData.activeCharacterId = parsedData.activeCharacterId || 'char_1';
          parsedData.themes = Array.isArray(parsedData.themes) ? parsedData.themes : THEMES;
          parsedData.activeThemeId = parsedData.activeThemeId || 'theme_default';
          
          // Periksa apakah misi harian perlu direset
          const now = Date.now();
          const lastResetDate = new Date(parsedData.lastDailyReset || 0);
          const today = new Date(now);
          
          // Jika hari berbeda, reset misi harian
          if (lastResetDate.getDate() !== today.getDate() || 
              lastResetDate.getMonth() !== today.getMonth() || 
              lastResetDate.getFullYear() !== today.getFullYear()) {
            
            // Hapus misi harian lama
            if (parsedData.missions && Array.isArray(parsedData.missions)) {
              const permanentMissions = parsedData.missions.filter(
                (m: Mission) => m.type !== 'daily'
              );
              
              // Tambahkan misi harian baru
              const newDailyMissions = getDailyMissions();
              parsedData.missions = [...permanentMissions, ...newDailyMissions];
              parsedData.lastDailyReset = now;
            } else {
              // Jika tidak ada misi, inisialisasi dengan misi baru
              parsedData.missions = getAllMissions();
              parsedData.lastDailyReset = now;
            }
            
            // Update login streak
            parsedData.loginStreak = (parsedData.loginStreak || 0) + 1;
          }
          
          // Filter booster yang sudah kedaluwarsa
          if (parsedData.activeBoosters && Array.isArray(parsedData.activeBoosters)) {
            parsedData.activeBoosters = parsedData.activeBoosters.filter(
              (b: ActiveBooster) => b.expiresAt > now
            );
          } else {
            parsedData.activeBoosters = [];
          }
          
          // Update total waktu bermain
          const lastLoginDate = new Date(parsedData.lastLoginDate || 0);
          const timeDiff = Math.floor((now - lastLoginDate.getTime()) / 1000);
          parsedData.totalTimePlayed = (parsedData.totalTimePlayed || 0) + timeDiff;
          parsedData.lastLoginDate = now;
          
          // Update stamina
          if (parsedData.lastStaminaUpdate) {
            const timeSinceLastUpdate = (now - parsedData.lastStaminaUpdate) / 60000; // Dalam menit
            const staminaToAdd = Math.floor(timeSinceLastUpdate * parsedData.staminaRegenRate);
            parsedData.stamina = Math.min(parsedData.stamina + staminaToAdd, parsedData.maxStamina);
            parsedData.lastStaminaUpdate = now;
          }
          
          // Cek status bonus stamina
          if (parsedData.staminaBonusActive && parsedData.staminaBonusEndTime < now) {
            parsedData.staminaBonusActive = false;
          }
          
          // Menghitung pendapatan offline
          const timeDiffMinutes = (now - lastLoginDate.getTime()) / (1000 * 60);
          
          // Batasi waktu offline maksimum menjadi 24 jam
          const maxOfflineMinutes = 24 * 60;
          const effectiveTimeDiff = Math.min(timeDiffMinutes, maxOfflineMinutes);
          
          // Hitung pendapatan offline
          let offlineEarnings = 0;
          
          // Hanya hitung jika pengguna memiliki penghasilan pasif
          if (parsedData.moneyPerSecond > 0) {
            const minutesAway = effectiveTimeDiff;
            const perMinuteEarnings = parsedData.moneyPerSecond * 60;
            
            // Faktor efisiensi: 50% dari pendapatan normal saat offline
            const efficiencyFactor = 0.5;
            
            offlineEarnings = Math.floor(perMinuteEarnings * minutesAway * efficiencyFactor);
          }
          
          parsedData.offlineEarnings = offlineEarnings;
          
          setGameState(parsedData);
        }
      } catch (error) {
        console.error('Error loading game data:', error);
      }
    };

    loadGameData();
    
    // Set up interval untuk update passive income
    const passiveIncomeInterval = setInterval(() => {
      updatePassiveIncome();
    }, 1000);
    
    // Set up interval untuk update booster dan stamina
    const gameUpdateInterval = setInterval(() => {
      updateGameState();
    }, 1000);
    
    // Clean up interval saat unmount
    return () => {
      clearInterval(passiveIncomeInterval);
      clearInterval(gameUpdateInterval);
    };
  }, []);

  // Simpan data ketika gameState berubah
  useEffect(() => {
    const saveGameData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      } catch (error) {
        console.error('Error saving game data:', error);
      }
    };

    saveGameData();
  }, [gameState]);
  
  // Update penghasilan pasif setiap detik
  const updatePassiveIncome = () => {
    if (gameState.moneyPerSecond <= 0) return;
    
    setGameState(prevState => {
      // Hitung pengali dari booster aktif
      const multiplier = calculateTotalMultiplier(prevState.activeBoosters || []);
      const autoMultiplier = calculateAutoClickMultiplier(prevState.activeBoosters || []);
      
      // Hitung penghasilan per detik dengan pengali
      const baseMoneyPerSecond = prevState.moneyPerSecond;
      const boostedMoneyPerSecond = baseMoneyPerSecond * multiplier * autoMultiplier;
      
      // Jika karakter aktif memberikan bonus autoClicker
      const activeCharacter = prevState.characters?.find(c => c.id === prevState.activeCharacterId);
      let characterBonus = 1;
      
      if (activeCharacter && activeCharacter.perk?.type === 'auto_bonus') {
        characterBonus = activeCharacter.perk.value;
      }
      
      // Hitung penghasilan final
      const finalMoneyPerSecond = boostedMoneyPerSecond * characterBonus;
      
      // Update nilai highestMoneyPerSecond jika perlu
      const newHighest = Math.max(prevState.highestMoneyPerSecond || 0, finalMoneyPerSecond);
      
      return {
        ...prevState,
        money: prevState.money + finalMoneyPerSecond,
        totalMoneyEarned: prevState.totalMoneyEarned + finalMoneyPerSecond,
        highestMoneyPerSecond: newHighest
      };
    });
  };
  
  // Update state game setiap detik (booster, stamina, dll)
  const updateGameState = () => {
    const now = Date.now();
    
    setGameState(prevState => {
      // Filter booster yang sudah kedaluwarsa
      const updatedActiveBoosters = Array.isArray(prevState.activeBoosters) 
        ? prevState.activeBoosters.filter(booster => booster.expiresAt > now)
        : [];
      
      // Update regenerasi stamina jika tidak penuh
      let stamina = prevState.stamina || 0;
      const lastUpdate = prevState.lastStaminaUpdate || now;
      const timeSinceLastUpdate = (now - lastUpdate) / 60000; // Dalam menit
      
      if (stamina < (prevState.maxStamina || 100)) {
        const regenRate = prevState.staminaBonusActive ? (prevState.staminaRegenRate || 5) * 2 : (prevState.staminaRegenRate || 5);
        const staminaToAdd = timeSinceLastUpdate * regenRate;
        stamina = Math.min(stamina + staminaToAdd, (prevState.maxStamina || 100));
      }
      
      // Cek status bonus stamina
      let staminaBonusActive = prevState.staminaBonusActive || false;
      if (staminaBonusActive && (prevState.staminaBonusEndTime || 0) < now) {
        staminaBonusActive = false;
      }
      
      // Hanya update state jika ada perubahan
      if (
        (!Array.isArray(prevState.activeBoosters) || updatedActiveBoosters.length !== prevState.activeBoosters.length) ||
        stamina !== prevState.stamina ||
        staminaBonusActive !== prevState.staminaBonusActive
      ) {
        return {
          ...prevState,
          activeBoosters: updatedActiveBoosters,
          stamina,
          staminaBonusActive,
          lastStaminaUpdate: now
        };
      }
      
      return prevState;
    });
    
    // Periksa achievements setiap interval
    checkAchievements();
  };
  
  // Fungsi untuk menambah uang saat klik
  const clickMoney = () => {
    setGameState(prevState => {
      // Buat salinan state untuk dimodifikasi
      const newState = {
        ...prevState,
        money: prevState.money + prevState.moneyPerClick,
        totalClicks: prevState.totalClicks + 1,
        totalMoneyEarned: prevState.totalMoneyEarned + prevState.moneyPerClick
      };
      
      // Update progres misi
      const updatedMissions = updateMissionProgress(
        prevState.missions,
        {
          clicks: 1,
          money: prevState.moneyPerClick,
          totalClicks: newState.totalClicks,
          totalMoney: newState.totalMoneyEarned
        }
      );
      
      newState.missions = updatedMissions;
      
      return newState;
    });
    
    // Buka upgrade baru berdasarkan jumlah uang
    checkAndUnlockUpgrades();
    
    // Periksa achievement
    checkAchievements();
  };

  // Fungsi untuk membeli upgrade
  const buyUpgrade = (upgradeId: string) => {
    setGameState(prevState => {
      // Temukan upgrade yang akan dibeli
      const upgradeIndex = prevState.upgrades.findIndex(u => u.id === upgradeId);
      
      if (upgradeIndex === -1) return prevState;
      
      const upgrade = prevState.upgrades[upgradeIndex];
      
      // Cek apakah pemain punya cukup uang
      if (prevState.money < upgrade.cost) return prevState;
      
      // Buat salinan array upgrade untuk dimodifikasi
      const updatedUpgrades = [...prevState.upgrades];
      
      // Tingkatkan level dan naikkan biaya untuk upgrade berikutnya
      updatedUpgrades[upgradeIndex] = {
        ...upgrade,
        level: upgrade.level + 1,
        cost: Math.floor(upgrade.cost * 1.5), // Tingkatkan biaya untuk pembelian berikutnya
      };
      
      // Hitung moneyPerClick baru berdasarkan semua upgrade
      const newMoneyPerClick = 1 + updatedUpgrades.reduce(
        (sum, u) => sum + u.multiplier * u.level, 
        0
      );
      
      // Update jumlah total upgrade yang dibeli
      const totalUpgradesBought = prevState.totalUpgradesBought + 1;
      
      // Update progres misi yang berkaitan dengan upgrade
      const updatedMissions = updateMissionProgress(
        prevState.missions,
        {
          upgrades: 1,
          totalUpgrades: totalUpgradesBought
        }
      );
      
      return {
        ...prevState,
        money: prevState.money - upgrade.cost,
        moneyPerClick: newMoneyPerClick,
        upgrades: updatedUpgrades,
        totalUpgradesBought,
        missions: updatedMissions
      };
    });
    
    // Periksa achievement setelah pembelian upgrade
    checkAchievements();
  };

  // Fungsi untuk mengklaim hadiah misi
  const claimMissionReward = (missionId: string) => {
    setGameState(prevState => {
      // Pastikan missions adalah array
      if (!Array.isArray(prevState.missions)) {
        return prevState;
      }

      // Temukan misi yang akan diklaim hadiahnya
      const missionIndex = prevState.missions.findIndex(m => m.id === missionId);
      
      if (missionIndex === -1) return prevState;
      
      const mission = prevState.missions[missionIndex];
      
      // Cek apakah misi sudah selesai dan belum diklaim
      if (!mission || !mission.isCompleted) return prevState;
      
      // Buat salinan array misi untuk dimodifikasi
      const updatedMissions = [...prevState.missions];
      
      // Tandai misi sebagai sudah diklaim dengan mengubah isCompleted menjadi false (tidak bisa diklaim lagi)
      updatedMissions[missionIndex] = {
        ...mission,
        isCompleted: false
      };
      
      // Berikan hadiah sesuai jenis
      let money = prevState.money || 0;
      let moneyPerClick = prevState.moneyPerClick || 1;
      
      // Pastikan upgrades adalah array
      const upgrades = Array.isArray(prevState.upgrades) ? [...prevState.upgrades] : [];
      
      // Jika karakter aktif memberikan bonus untuk hadiah misi
      let missionRewardMultiplier = 1;
      
      if (Array.isArray(prevState.characters)) {
        const activeCharacter = prevState.characters.find(c => c.id === prevState.activeCharacterId);
        if (activeCharacter && activeCharacter.perk && activeCharacter.perk.type === 'mission_bonus') {
          missionRewardMultiplier = activeCharacter.perk.value;
        }
      }
      
      // Pastikan reward ada
      if (mission.reward) {
        switch (mission.reward.type) {
          case 'money':
            money += (mission.reward.value || 0) * missionRewardMultiplier;
            break;
          case 'multiplier':
            moneyPerClick *= (mission.reward.value || 1);
            break;
          case 'free_upgrade':
            if (mission.reward.upgradeId) {
              const upgradeIndex = upgrades.findIndex(u => u.id === mission.reward.upgradeId);
              if (upgradeIndex !== -1) {
                // Tingkatkan level upgrade tanpa biaya
                upgrades[upgradeIndex] = {
                  ...upgrades[upgradeIndex],
                  level: (upgrades[upgradeIndex].level || 0) + (mission.reward.value || 1)
                };
                
                // Hitung ulang moneyPerClick
                moneyPerClick = 1 + upgrades.reduce(
                  (sum, u) => sum + (u.multiplier || 0) * (u.level || 0), 
                  0
                );
              }
            }
            break;
        }
      }
      
      return {
        ...prevState,
        money,
        moneyPerClick,
        upgrades,
        missions: updatedMissions
      };
    });
  };

  // Fungsi untuk update progres misi
  const updateMissionProgress = (
    missions: Mission[],
    progress: {
      clicks?: number;
      money?: number;
      upgrades?: number;
      totalClicks?: number;
      totalMoney?: number;
      totalUpgrades?: number;
    }
  ): Mission[] => {
    return missions.map(mission => {
      // Jika misi sudah selesai, lewati
      if (mission.isCompleted) return mission;
      
      let current = mission.current;
      
      // Update berdasarkan jenis misi
      if (mission.id === 'daily_clicks' && progress.clicks) {
        current += progress.clicks;
      }
      else if (mission.id === 'daily_money' && progress.money) {
        current += progress.money;
      }
      else if (mission.id === 'daily_upgrades' && progress.upgrades) {
        current += progress.upgrades;
      }
      else if (mission.id === 'challenge_millionaire' && progress.totalMoney) {
        current = progress.totalMoney; // Set ke total uang yang pernah didapatkan
      }
      else if (mission.id === 'challenge_clicks' && progress.totalClicks) {
        current = progress.totalClicks; // Set ke total klik
      }
      else if (mission.id === 'challenge_upgrades' && progress.totalUpgrades) {
        current = progress.totalUpgrades; // Set ke total upgrade yang pernah dibeli
      }
      
      // Cek apakah misi selesai
      const isCompleted = current >= mission.target;
      
      return {
        ...mission,
        current,
        isCompleted: isCompleted || mission.isCompleted
      };
    });
  };

  // Fungsi untuk memeriksa dan membuka upgrade baru
  const checkAndUnlockUpgrades = () => {
    setGameState(prevState => {
      const updatedUpgrades = [...prevState.upgrades];
      let hasChanges = false;

      // Logika untuk membuka upgrade4
      if (!updatedUpgrades[3].unlocked && prevState.money >= 500) {
        updatedUpgrades[3].unlocked = true;
        hasChanges = true;
      }

      // Logika untuk membuka upgrade5
      if (!updatedUpgrades[4].unlocked && prevState.money >= 2500) {
        updatedUpgrades[4].unlocked = true;
        hasChanges = true;
      }
      
      // Logika untuk membuka auto-clicker3
      const autoClickers = [...prevState.autoClickers];
      if (!autoClickers[2].unlocked && prevState.money >= 1500) {
        autoClickers[2].unlocked = true;
        hasChanges = true;
      }
      
      // Logika untuk membuka auto-clicker4
      if (!autoClickers[3].unlocked && prevState.money >= 5000) {
        autoClickers[3].unlocked = true;
        hasChanges = true;
      }

      if (hasChanges) {
        return {
          ...prevState,
          upgrades: updatedUpgrades,
          autoClickers: autoClickers,
        };
      }

      return prevState;
    });
  };

  // Fungsi untuk memeriksa achievement
  const checkAchievements = () => {
    setGameState(prevState => {
      if (!Array.isArray(prevState.achievements)) {
        return prevState;
      }
      
      const gameStats = {
        totalMoneyEarned: prevState.totalMoneyEarned,
        totalClicks: prevState.totalClicks,
        totalUpgradesBought: prevState.totalUpgradesBought,
        loginStreak: prevState.loginStreak,
        totalTimePlayed: prevState.totalTimePlayed
      };
      
      // Cek setiap achievement
      const updatedAchievements = prevState.achievements.map(achievement => {
        // Jika achievement sudah selesai, tidak perlu diubah
        if (achievement.isCompleted) return achievement;
        
        // Cek apakah requirement sudah terpenuhi
        let isCompleted = false;
        
        switch (achievement.requirement.type) {
          case 'money':
            isCompleted = gameStats.totalMoneyEarned >= achievement.requirement.value;
            break;
          case 'clicks':
            isCompleted = gameStats.totalClicks >= achievement.requirement.value;
            break;
          case 'upgrades':
            isCompleted = gameStats.totalUpgradesBought >= achievement.requirement.value;
            break;
          case 'login_streak':
            isCompleted = gameStats.loginStreak >= achievement.requirement.value;
            break;
          case 'playtime':
            isCompleted = gameStats.totalTimePlayed >= achievement.requirement.value;
            break;
        }
        
        // Update status achievement
        if (isCompleted) {
          return {
            ...achievement,
            isCompleted: true
          };
        }
        
        return achievement;
      });
      
      // Hanya update state jika ada achievement yang berubah
      if (JSON.stringify(updatedAchievements) !== JSON.stringify(prevState.achievements)) {
        return {
          ...prevState,
          achievements: updatedAchievements
        };
      }
      
      return prevState;
    });
  };

  // Reset game ke nilai default
  const resetGame = () => {
    setGameState(DEFAULT_GAME_STATE);
  };

  // Fungsi untuk membeli auto-clicker
  const buyAutoClicker = (autoClickerId: string) => {
    setGameState(prevState => {
      // Temukan auto-clicker yang akan dibeli
      const autoClickerIndex = prevState.autoClickers.findIndex(a => a.id === autoClickerId);
      
      if (autoClickerIndex === -1) return prevState;
      
      const autoClicker = prevState.autoClickers[autoClickerIndex];
      
      // Cek apakah pemain punya cukup uang
      if (prevState.money < autoClicker.currentPrice) return prevState;
      
      // Buat salinan array auto-clicker untuk dimodifikasi
      const updatedAutoClickers = [...prevState.autoClickers];
      
      // Tingkatkan level dan naikkan harga
      const newLevel = autoClicker.level + 1;
      const newPrice = Math.floor(autoClicker.basePrice * Math.pow(1.4, newLevel));
      
      updatedAutoClickers[autoClickerIndex] = {
        ...autoClicker,
        level: newLevel,
        currentPrice: newPrice
      };
      
      // Hitung ulang moneyPerSecond
      let newMoneyPerSecond = 0;
      updatedAutoClickers.forEach(clicker => {
        newMoneyPerSecond += clicker.moneyPerSecond * clicker.level;
      });
      
      // Jika ini adalah auto-clicker yang belum terbuka, buka auto-clicker berikutnya jika ada
      if (autoClicker.level === 0) {
        // Cari auto-clicker berikutnya yang belum terbuka
        const nextLockedIndex = updatedAutoClickers.findIndex(a => !a.unlocked);
        if (nextLockedIndex !== -1 && nextLockedIndex > autoClickerIndex) {
          updatedAutoClickers[nextLockedIndex] = {
            ...updatedAutoClickers[nextLockedIndex],
            unlocked: true
          };
        }
      }
      
      return {
        ...prevState,
        money: prevState.money - autoClicker.currentPrice,
        autoClickers: updatedAutoClickers,
        moneyPerSecond: newMoneyPerSecond
      };
    });
  };
  
  // Fungsi untuk mengaktifkan booster
  const activateBooster = (boosterId: string) => {
    setGameState(prevState => {
      // Temukan booster yang akan diaktifkan
      const booster = BOOSTERS.find(b => b.id === boosterId);
      
      if (!booster) return prevState;
      
      // Cek apakah pemain punya cukup uang
      if (prevState.money < booster.price) return prevState;
      
      // Cek apakah booster dalam cooldown
      const cooldownEndsAt = prevState.boosterCooldowns[boosterId] || 0;
      const now = Date.now();
      
      if (cooldownEndsAt > now) return prevState;
      
      // Untuk booster tipe instant_money, langsung berikan uang tanpa menambah ke active boosters
      if (booster.type === 'instant_money') {
        const boosterCooldowns = {
          ...prevState.boosterCooldowns,
          [boosterId]: now + booster.cooldown
        };
        
        return {
          ...prevState,
          money: prevState.money - booster.price + booster.value,
          totalMoneyEarned: prevState.totalMoneyEarned + booster.value,
          boosterCooldowns
        };
      }
      
      // Untuk tipe booster lainnya, tambahkan ke active boosters
      
      // Hitung durasi dengan modifier dari karakter jika ada
      let duration = booster.duration;
      const activeCharacter = prevState.characters.find(c => c.id === prevState.activeCharacterId);
      
      if (activeCharacter && activeCharacter.perk.type === 'booster_duration') {
        duration *= activeCharacter.perk.value;
      }
      
      const activeBooster: ActiveBooster = {
        ...booster,
        startedAt: now,
        expiresAt: now + duration
      };
      
      // Update cooldown
      const boosterCooldowns = {
        ...prevState.boosterCooldowns,
        [boosterId]: now + booster.cooldown
      };
      
      return {
        ...prevState,
        money: prevState.money - booster.price,
        activeBoosters: [...prevState.activeBoosters, activeBooster],
        boosterCooldowns
      };
    });
  };

  const buyCharacter = (characterId: string) => {
    setGameState(prevState => {
      const character = prevState.characters.find(c => c.id === characterId);
      
      if (!character) return prevState;
      if (character.unlocked) return prevState;
      if (prevState.money < character.price) return prevState;
      
      return {
        ...prevState,
        money: prevState.money - character.price,
        characters: prevState.characters.map(c => 
          c.id === characterId ? { ...c, unlocked: true } : c
        )
      };
    });
  };
  
  const setActiveCharacter = (characterId: string) => {
    setGameState(prevState => {
      const character = prevState.characters.find(c => c.id === characterId);
      
      if (!character || !character.unlocked) return prevState;
      
      return {
        ...prevState,
        activeCharacterId: characterId
      };
    });
  };
  
  const buyTheme = (themeId: string) => {
    setGameState(prevState => {
      const theme = prevState.themes.find(t => t.id === themeId);
      
      if (!theme) return prevState;
      if (theme.unlocked) return prevState;
      if (prevState.money < theme.price) return prevState;
      
      return {
        ...prevState,
        money: prevState.money - theme.price,
        themes: prevState.themes.map(t => 
          t.id === themeId ? { ...t, unlocked: true } : t
        )
      };
    });
  };
  
  const setActiveTheme = (themeId: string) => {
    setGameState(prevState => {
      const theme = prevState.themes.find(t => t.id === themeId);
      
      if (!theme || !theme.unlocked) return prevState;
      
      return {
        ...prevState,
        activeThemeId: themeId
      };
    });
  };
  
  const useStamina = (amount: number) => {
    let success = false;
    
    setGameState(prevState => {
      if (prevState.stamina < amount) {
        return prevState; // Tidak cukup stamina
      }
      
      success = true;
      return {
        ...prevState,
        stamina: Math.max(0, prevState.stamina - amount)
      };
    });
    
    return success;
  };
  
  const activateStaminaBonus = (durationMinutes: number) => {
    setGameState(prevState => {
      const now = Date.now();
      
      return {
        ...prevState,
        staminaBonusActive: true,
        staminaBonusEndTime: now + durationMinutes * 60 * 1000
      };
    });
  };

  const claimAchievementReward = (achievementId: string) => {
    setGameState(prevState => {
      // Pastikan achievements adalah array
      if (!Array.isArray(prevState.achievements)) {
        return prevState;
      }

      // Temukan achievement yang akan diklaim hadiahnya
      const achievementIndex = prevState.achievements.findIndex(a => a.id === achievementId);
      
      if (achievementIndex === -1) return prevState;
      
      const achievement = prevState.achievements[achievementIndex];
      
      // Cek apakah achievement sudah selesai dan belum diklaim
      if (!achievement || !achievement.isCompleted || achievement.isCollected) {
        return prevState;
      }
      
      // Buat salinan array achievements untuk dimodifikasi
      const updatedAchievements = [...prevState.achievements];
      
      // Tandai achievement sebagai sudah diklaim
      updatedAchievements[achievementIndex] = {
        ...achievement,
        isCollected: true
      };
      
      // Update state berdasarkan tipe hadiah
      let money = prevState.money;
      let moneyPerClick = prevState.moneyPerClick;
      let maxStamina = prevState.maxStamina;
      
      switch (achievement.reward.type) {
        case 'money':
          money += achievement.reward.value;
          break;
          
        case 'multiplier':
          moneyPerClick *= achievement.reward.value;
          break;
          
        case 'stamina':
          maxStamina += achievement.reward.value;
          break;
          
        case 'experience':
          // TODO: Implementasi sistem experience
          break;
      }
      
      // Update jumlah achievement yang sudah dibuka
      const achievementsUnlocked = prevState.achievementsUnlocked + 1;
      
      return {
        ...prevState,
        money,
        moneyPerClick,
        maxStamina,
        achievements: updatedAchievements,
        achievementsUnlocked
      };
    });
  };

  const collectOfflineEarnings = (doubleReward?: boolean) => {
    setGameState(prevState => {
      // Hitung pendapatan yang akan dikumpulkan
      const earnedAmount = prevState.offlineEarnings;
      
      // Jika tidak ada pendapatan, tidak perlu update
      if (earnedAmount <= 0) return prevState;
      
      // Jika doubleReward aktif, kalikan dengan 2
      const finalAmount = doubleReward ? earnedAmount * 2 : earnedAmount;
      
      return {
        ...prevState,
        money: prevState.money + finalAmount,
        totalMoneyEarned: prevState.totalMoneyEarned + finalAmount,
        offlineEarnings: 0 // Reset pendapatan offline setelah dikumpulkan
      };
    });
  };

  // Implementasi fungsi buyBooster
  const buyBooster = (boosterId: string) => {
    setGameState(prevState => {
      // Cari booster yang ingin dibeli dalam koleksi
      const boosterIndex = prevState.boosters.findIndex(b => b.id === boosterId);
      
      if (boosterIndex === -1) return prevState;
      
      const booster = prevState.boosters[boosterIndex];
      
      // Cek apakah pemain memiliki cukup uang
      if (prevState.money < booster.price) return prevState;
      
      // Kurangi uang pemain
      const updatedMoney = prevState.money - booster.price;
      
      // Tambahkan ke booster yang aktif dengan waktu kedaluwarsa
      const now = Date.now();
      const expiresAt = now + booster.duration;
      
      // Untuk booster tipe instant_money, langsung berikan uang
      if (booster.type === 'instant_money') {
        // Update cooldown
        const boosterCooldowns = {
          ...prevState.boosterCooldowns,
          [boosterId]: now + booster.cooldown
        };
        
        return {
          ...prevState,
          money: updatedMoney + booster.value,
          totalMoneyEarned: prevState.totalMoneyEarned + booster.value,
          boosterCooldowns
        };
      }
      
      // Untuk tipe booster lainnya, tambahkan ke active boosters
      const activeBooster: ActiveBooster = {
        ...booster,
        startedAt: now,
        expiresAt: expiresAt
      };
      
      // Update cooldown
      const boosterCooldowns = {
        ...prevState.boosterCooldowns,
        [boosterId]: now + booster.cooldown
      };
      
      return {
        ...prevState,
        money: updatedMoney,
        activeBoosters: [...prevState.activeBoosters, activeBooster],
        boosterCooldowns
      };
    });
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      clickMoney, 
      buyUpgrade, 
      resetGame, 
      claimMissionReward,
      buyAutoClicker,
      activateBooster,
      buyBooster,
      buyCharacter,
      setActiveCharacter,
      buyTheme,
      setActiveTheme,
      useStamina,
      activateStaminaBonus,
      claimAchievementReward,
      collectOfflineEarnings
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook untuk menggunakan GameContext
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}; 