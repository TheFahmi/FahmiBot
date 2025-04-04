import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, ScrollView, Dimensions, StatusBar, GestureResponderEvent } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameContext } from '../contexts/GameContext';
import formatMoney from '../utils/formatMoney';
import ClickButton from '../components/ClickButton';
import UpgradeItem from '../components/UpgradeItem';
import BusinessItem from '../components/BusinessItem';
import MoneyCard from '../components/MoneyCard';
import { showInfoNotification, showWarningNotification } from '../utils/notifications';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type TabType = 'upgrades' | 'businesses';

// Fungsi untuk menghitung harga upgrade
const calculateUpgradePrice = (basePrice: number, level: number): number => {
  return Math.floor(basePrice * Math.pow(1.1, level));
};

// Fungsi untuk menghitung harga bisnis
const calculateBusinessPrice = (basePrice: number, level: number): number => {
  return Math.floor(basePrice * Math.pow(1.15, level));
};

export default function HomeScreen() {
  const { 
    state,
    addMoney,
    buyUpgrade,
    buyBusiness,
    upgradeBusiness,
    collectBusinessIncome,
    saveGame,
  } = useGameContext();
  
  // State untuk notifikasi penyimpanan
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const saveNotificationOpacity = useRef(new Animated.Value(0)).current;
  
  // Fungsi untuk menyimpan game dan menampilkan notifikasi
  const handleSaveGame = async () => {
    const success = await saveGame();
    
    // Tampilkan notifikasi bahwa game berhasil disimpan
    if (success) {
      showInfoNotification('Game berhasil disimpan!', 'content-save', 2000);
    } else {
      showInfoNotification('Gagal menyimpan game', 'alert', 2000);
    }
  };
  
  // Memberikan nilai default untuk state yang mungkin undefined
  const { 
    money = 0, 
    moneyPerClick = 0, 
    moneyPerSecond = 0,
    totalMoney = 0, 
    totalClicks = 0,
    upgrades = [], 
    businesses = [],
    stats = {
      playTime: 0,
      totalClicks: 0,
      totalUpgradesBought: 0,
      totalBusinessesBought: 0,
      highestMoneyPerClick: 0,
      highestMoneyPerSecond: 0,
      totalMoneyFromClicks: 0,
      totalMoneyFromBusinesses: 0,
      startTime: Date.now()
    }
  } = state || {};
  
  const [scale] = useState(new Animated.Value(1));
  const [showMoneyAnimation, setShowMoneyAnimation] = useState(false);
  const [moneyAnimValue] = useState(new Animated.Value(0));
  const [clickPosition, setClickPosition] = useState({ x: screenWidth / 2, y: 300 });
  // State untuk menyimpan animasi klik yang aktif
  const [clickAnimations, setClickAnimations] = useState<Array<{id: number, amount: number, x: number, y: number}>>([]);
  // Counter untuk ID unik animasi
  const animationIdCounter = useRef(0);
  const [activeTab, setActiveTab] = useState<TabType>('upgrades');
  const [showPassiveIncomeToast, setShowPassiveIncomeToast] = useState(false);
  const [passiveAnimValue] = useState(new Animated.Value(0));
  const buttonScale = useRef(new Animated.Value(1)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  
  // Anti-cheat: Click tracking
  const clickTimes = useRef<number[]>([]).current;
  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState(0);
  const [warningShown, setWarningShown] = useState(false);
  
  // Anti-cheat: Fungsi untuk mengecek pola klik yang tidak wajar
  const checkClickPattern = () => {
    const now = Date.now();
    
    // Simpan waktu klik
    clickTimes.push(now);
    
    // Hanya periksa jika sudah ada cukup sampel klik
    if (clickTimes.length >= 20) {
      // Hapus entri lebih dari 20 detik yang lalu
      while (clickTimes.length > 0 && now - clickTimes[0] > 20000) {
        clickTimes.shift();
      }
      
      // Hitung klik per detik rata-rata dalam 3 detik terakhir
      const recentClicks = clickTimes.filter(time => now - time <= 3000);
      const clicksPerSecond = recentClicks.length / 3;
      
      // Cek interval antar klik untuk mendeteksi pola yang konsisten (ciri autoclicker)
      if (recentClicks.length >= 15) {
        const intervals = [];
        for (let i = 1; i < recentClicks.length; i++) {
          intervals.push(recentClicks[i] - recentClicks[i-1]);
        }
        
        // Hitungan standard deviasi interval
        const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
        const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);
        
        // Membuat deteksi lebih toleran
        // Auto clicker biasanya memiliki interval yang sangat konsisten (stdDev rendah)
        // dan klik per detik tinggi
        if ((stdDev < 20 && clicksPerSecond > 8) || clicksPerSecond > 15) {
          if (!isClickBlocked) {
            setIsClickBlocked(true);
            const blockDuration = 30000; // 30 detik
            setBlockEndTime(now + blockDuration);
            
            // Tampilkan peringatan
            showWarningNotification(
              'Terdeteksi pola klik tidak wajar! Klik dinonaktifkan sementara.',
              'alert-circle',
              5000
            );
            
            // Timer untuk menghapus blokir
            setTimeout(() => {
              setIsClickBlocked(false);
              clickTimes.length = 0; // Hapus semua entri
            }, blockDuration);
          }
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Efek animasi ketika tombol diklik
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Animasi uang bertambah
    setShowMoneyAnimation(true);
    moneyAnimValue.setValue(0);
    Animated.timing(moneyAnimValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setShowMoneyAnimation(false);
    });
  };
  
  // Fungsi untuk menangani klik
  const handleClick = (event?: GestureResponderEvent) => {
    // Cek jika klik sedang diblokir
    if (isClickBlocked) {
      // Tampilkan pesan blokir jika belum ditampilkan
      if (!warningShown) {
        setWarningShown(true);
        const remainingTime = Math.ceil((blockEndTime - Date.now()) / 1000);
        
        showWarningNotification(
          `Klik diblokir! Tunggu ${remainingTime} detik lagi.`,
          'lock-clock',
          3000
        );
        
        setTimeout(() => setWarningShown(false), 3000);
      }
      return;
    }
    
    // Deteksi pola klik mencurigakan
    if (!checkClickPattern()) {
      // Hanya lanjutkan jika tidak ada pola yang mencurigakan
      animateButton();
      
      // Hitung jumlah uang yang didapat dari klik
      const baseMoneyPerClick = moneyPerClick || 1; // Dapatkan minimal 1 koin jika moneyPerClick masih 0
      // Variasi acak untuk membuat klik lebih menyenangkan (± 5%)
      const variationPercent = 0.95 + (Math.random() * 0.1);
      const earnedMoney = Math.floor(baseMoneyPerClick * variationPercent);
      
      // Tambahkan uang ke saldo
      addMoney(earnedMoney, 'click');
      
      // Dapatkan posisi klik untuk animasi
      let posX = screenWidth / 2;
      let posY = 300;
      
      if (event && event.nativeEvent) {
        posX = event.nativeEvent.locationX;
        posY = event.nativeEvent.locationY;
        setClickPosition({
          x: posX,
          y: posY,
        });
      }
      
      // Tambahkan animasi +(angka) perklik
      const newAnimation = {
        id: animationIdCounter.current++,
        amount: earnedMoney,
        x: posX - 40 + Math.random() * 80, // Acak posisi di sekitar klik
        y: posY - 20 - Math.random() * 40,  // Acak posisi di atas klik
      };
      
      setClickAnimations(prev => [...prev, newAnimation]);
      
      // Hapus animasi setelah 800ms
      setTimeout(() => {
        setClickAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
      }, 800);
      
      // Efek visual tambahan saat klik untuk memberikan feedback
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1.02,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  
  // Fungsi untuk membeli business
  const handleBuyBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;
    
    if (business.owned) {
      // Jika bisnis sudah dimiliki, lakukan upgrade
      upgradeBusiness(businessId);
    } else {
      // Jika bisnis belum dimiliki, beli bisnis baru
      buyBusiness(businessId);
    }
  };

  // Fungsi untuk membeli upgrade
  const handleBuyUpgrade = (upgradeId: string) => {
    buyUpgrade(upgradeId);
  };
  
  // Tampilkan toast passive income
  useEffect(() => {
    if (moneyPerSecond > 0) {
      const timer = setInterval(() => {
        setShowPassiveIncomeToast(true);
        passiveAnimValue.setValue(0);
        
        Animated.timing(passiveAnimValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }).start(() => {
          setShowPassiveIncomeToast(false);
        });
      }, 10000); // Tampilkan setiap 10 detik
      
      return () => clearInterval(timer);
    }
  }, [moneyPerSecond]);
  
  // Render tab upgrades
  const renderUpgradesTab = () => (
    <ScrollView style={styles.tabContent}>
      {upgrades.map((upgrade) => (
        <UpgradeItem
          key={upgrade.id}
          upgrade={upgrade}
          onPress={() => handleBuyUpgrade(upgrade.id)}
          disabled={money < calculateUpgradePrice(upgrade.basePrice, upgrade.level)}
          owned={upgrade.level > 0}
        />
      ))}
    </ScrollView>
  );
  
  // Render tab businesses
  const renderBusinessesTab = () => (
    <ScrollView style={styles.tabContent}>
      {businesses.map((business) => (
        <BusinessItem
          key={business.id}
          business={business}
          onPress={() => handleBuyBusiness(business.id)}
          disabled={business.owned 
            ? money < calculateBusinessPrice(business.basePrice, business.level) 
            : money < business.basePrice}
          owned={business.owned}
        />
      ))}
    </ScrollView>
  );
  
  return (
    <LinearGradient
      colors={['#E8F5E9', '#F5F7FA']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar translucent backgroundColor="transparent" />
      
      {/* Header dan kartu */}
      <View style={styles.header}>
        <Text style={styles.gameTitle}>Empire Business</Text>
        <MaterialCommunityIcons name="crown" size={24} color="#FFC107" />
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveGame}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="content-save" size={22} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      {/* Layout Container dengan ScrollView */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Kartu Saldo */}
        <View style={styles.cardContainer}>
          <MoneyCard 
            money={money || 0} 
            moneyPerClick={moneyPerClick || 0} 
            totalMoney={totalMoney || 0} 
          />
        </View>
        
        {/* Passive income indicator */}
        {moneyPerSecond > 0 && (
          <View style={styles.passiveIncomeContainer}>
            <MaterialCommunityIcons name="cash-multiple" size={18} color="#4CAF50" />
            <Text style={styles.passiveIncomeText}>
              +{formatMoney(Math.floor(moneyPerSecond || 0))}/detik
            </Text>
          </View>
        )}
        
        {/* Area bisnis dan klik */}
        <View style={styles.businessArea}>
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.clickAreaOuter}
            onPress={handleClick}
          >
            <Animated.View 
              style={[
                styles.clickContainer,
                {
                  transform: [{ scale }],
                },
              ]}
            >
              <ClickButton 
                onPress={handleClick} 
                title="KLIK UNTUK UANG" 
                style={styles.clickButton}
              />
            </Animated.View>
            
            {/* Animasi uang bertambah */}
            {showMoneyAnimation && (
              <Animated.View 
                style={[
                  styles.moneyAnimation,
                  {
                    opacity: moneyAnimValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0.8, 0],
                    }),
                    transform: [
                      {
                        translateY: moneyAnimValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -80],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.moneyAnimationText}>+{formatMoney(moneyPerClick || 0)}</Text>
              </Animated.View>
            )}
            
            {/* Tampilkan semua animasi klik yang aktif */}
            {clickAnimations.map((anim) => {
              // Buat nilai animasi untuk setiap instance
              const animOpacity = new Animated.Value(1);
              const animTranslateY = new Animated.Value(0);
              const animScale = new Animated.Value(1);
              
              // Mulai animasi untuk instance ini
              Animated.parallel([
                Animated.timing(animOpacity, {
                  toValue: 0,
                  duration: 800,
                  useNativeDriver: true,
                }),
                Animated.timing(animTranslateY, {
                  toValue: -50,
                  duration: 800,
                  useNativeDriver: true,
                }),
                Animated.sequence([
                  Animated.timing(animScale, {
                    toValue: 1.2,
                    duration: 150,
                    useNativeDriver: true,
                  }),
                  Animated.timing(animScale, {
                    toValue: 1,
                    duration: 650,
                    useNativeDriver: true,
                  }),
                ]),
              ]).start();
              
              return (
                <Animated.View
                  key={anim.id}
                  style={[
                    styles.clickAnimationContainer,
                    {
                      position: 'absolute',
                      left: anim.x,
                      top: anim.y,
                      opacity: animOpacity,
                      transform: [
                        { translateY: animTranslateY },
                        { scale: animScale }
                      ]
                    }
                  ]}
                >
                  <Text style={styles.clickAnimationText}>+{formatMoney(anim.amount)}</Text>
                </Animated.View>
              );
            })}
          </TouchableOpacity>
        </View>
        
        {/* Elemen dekoratif */}
        <View style={styles.decorativeElements}>
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </View>
      </ScrollView>
      
      {/* Passive income toast */}
      {showPassiveIncomeToast && (
        <Animated.View
          style={[
            styles.passiveToast,
            {
              opacity: passiveAnimValue.interpolate({
                inputRange: [0, 0.1, 0.9, 1],
                outputRange: [0, 1, 1, 0],
              }),
            },
          ]}
        >
          <MaterialCommunityIcons name="cash-multiple" size={18} color="#FFFFFF" />
          <Text style={styles.passiveToastText}>
            +{formatMoney(Math.floor(moneyPerSecond || 0))} ditambahkan!
          </Text>
        </Animated.View>
      )}
      
      {/* Area upgrade/businesses dengan tabs */}
      <View style={styles.upgradeArea}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'upgrades' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('upgrades')}
          >
            <MaterialCommunityIcons 
              name="arrow-up-bold-circle" 
              size={18} 
              color={activeTab === 'upgrades' ? '#4CAF50' : '#78909C'} 
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'upgrades' && styles.activeTabText,
              ]}
            >
              Upgrade
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'businesses' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('businesses')}
          >
            <MaterialCommunityIcons 
              name="store" 
              size={18} 
              color={activeTab === 'businesses' ? '#4CAF50' : '#78909C'} 
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'businesses' && styles.activeTabText,
              ]}
            >
              Bisnis
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'upgrades' ? renderUpgradesTab() : renderBusinessesTab()}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: StatusBar.currentHeight || 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    zIndex: 10,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    position: 'relative',
    zIndex: 5,
    marginBottom: 12,
  },
  passiveIncomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  passiveIncomeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  decorCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    top: '20%',
    left: -50,
  },
  decorCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
    bottom: '40%',
    right: -100,
  },
  businessArea: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 5,
  },
  clickAreaOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    position: 'relative',
  },
  clickContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  moneyAnimation: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    marginLeft: -40,
    zIndex: 999,
    width: 80,
    alignItems: 'center',
  },
  moneyAnimationText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  passiveToast: {
    position: 'absolute',
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    top: 100,
    left: '50%',
    marginLeft: -90,
    width: 180,
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 5,
  },
  passiveToastText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  upgradeArea: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    height: '38%',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#78909C',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  tabContent: {
    flex: 1,
    padding: 12,
  },
  saveButton: {
    position: 'absolute',
    right: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  // Styling untuk animasi klik yang stack
  clickAnimationContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  clickAnimationText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
}); 