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
import { showInfoNotification } from '../utils/notifications';

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
    state: {
      money, 
      moneyPerClick, 
      moneyPerSecond,
      totalMoney, 
      totalClicks,
      upgrades, 
      businesses,
    },
    addMoney,
    buyUpgrade,
    buyBusiness,
    collectBusinessIncome,
  } = useGameContext();
  
  const [scale] = useState(new Animated.Value(1));
  const [showMoneyAnimation, setShowMoneyAnimation] = useState(false);
  const [moneyAnimValue] = useState(new Animated.Value(0));
  const [clickPosition, setClickPosition] = useState({ x: screenWidth / 2, y: 300 });
  const [activeTab, setActiveTab] = useState<TabType>('upgrades');
  const [showPassiveIncomeToast, setShowPassiveIncomeToast] = useState(false);
  const [passiveAnimValue] = useState(new Animated.Value(0));
  const buttonScale = useRef(new Animated.Value(1)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  
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
    animateButton();
    addMoney(moneyPerClick, 'click');
    
    // Dapatkan posisi klik untuk animasi
    if (event && event.nativeEvent) {
      setClickPosition({
        x: event.nativeEvent.locationX,
        y: event.nativeEvent.locationY,
      });
    }
  };
  
  // Fungsi untuk membeli upgrade
  const handleBuyUpgrade = (upgradeId: string) => {
    buyUpgrade(upgradeId);
  };

  // Fungsi untuk membeli business
  const handleBuyBusiness = (businessId: string) => {
    buyBusiness(businessId);
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
          disabled={money < (business.owned ? calculateBusinessPrice(business.basePrice, business.level) : business.basePrice)}
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
}); 