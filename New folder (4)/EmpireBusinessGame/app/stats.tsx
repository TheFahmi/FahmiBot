import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameContext } from '../contexts/GameContext';
import formatMoney from '../utils/formatMoney';
import { showInfoNotification } from '../utils/notifications';

// Fungsi untuk format waktu
const formatPlaytime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours} jam ${minutes} menit`;
  } else if (minutes > 0) {
    return `${minutes} menit ${remainingSeconds} detik`;
  } else {
    return `${seconds} detik`;
  }
};

// Fungsi untuk mendapatkan nama ikon yang valid
const getIconName = (iconName: string): any => {
  return iconName as any;
};

// Fungsi untuk menghitung pendapatan bisnis
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

export default function StatsScreen() {
  const { state, saveGame } = useGameContext();
  const {
    money = 0,
    moneyPerClick = 0,
    moneyPerSecond = 0,
    totalMoney = 0,
    totalMoneySpent = 0,
    totalClicks = 0,
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
    },
    upgrades = [],
    businesses = []
  } = state || {};
  
  // Memeriksa apakah stats ada, jika tidak berikan nilai default
  const safeStats = stats || {
    playTime: 0,
    totalClicks: 0,
    totalUpgradesBought: 0,
    totalBusinessesBought: 0,
    highestMoneyPerClick: 0,
    highestMoneyPerSecond: 0,
    totalMoneyFromClicks: 0,
    totalMoneyFromBusinesses: 0,
    startTime: Date.now()
  };
  
  // Hitung persentase kemajuan menuju kartu Diamond
  const progressToDiamond = Math.min(100, (totalMoney / 1000000) * 100);
  
  // Statistik tambahan
  const averageClickValue = totalClicks > 0 ? Math.round(safeStats.totalMoneyFromClicks / totalClicks) : 0;
  const passiveIncomePercentage = totalMoney > 0 ? ((moneyPerSecond * 3600) / totalMoney) * 100 : 0;
  
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
  
  // Render statistik singkat
  const renderStatItem = (
    icon: string, 
    title: string, 
    value: string | number,
    color: string = '#2196F3'
  ) => (
    <View style={styles.statItem}>
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={getIconName(icon)} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
  
  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistik Permainan</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveGame}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="content-save" size={22} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Ringkasan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan</Text>
          <View style={styles.statsGrid}>
            {renderStatItem('cash-multiple', 'Uang Saat Ini', formatMoney(money), '#4CAF50')}
            {renderStatItem('cash-plus', 'Total Dihasilkan', formatMoney(totalMoney), '#FF9800')}
            {renderStatItem('cash-minus', 'Total Dihabiskan', formatMoney(totalMoneySpent), '#F44336')}
            {renderStatItem('cursor-default-click', 'Per Klik', formatMoney(moneyPerClick), '#2196F3')}
            {renderStatItem('cash-clock', 'Per Detik', formatMoney(moneyPerSecond), '#9C27B0')}
            {renderStatItem('timer-outline', 'Waktu Bermain', formatPlaytime(safeStats.playTime), '#607D8B')}
          </View>
        </View>
        
        {/* Progres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progres</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressTitle}>Menuju Kartu Diamond</Text>
              <Text style={styles.progressValue}>{progressToDiamond.toFixed(1)}%</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${progressToDiamond}%` }
                ]} 
              />
            </View>
            
            <View style={styles.progressDetails}>
              <Text style={styles.progressDetailText}>
                {formatMoney(totalMoney)} / {formatMoney(1000000)}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Aktivitas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktivitas</Text>
          <View style={styles.statsGrid}>
            {renderStatItem('cursor-pointer', 'Total Klik', safeStats.totalClicks, '#FF5722')}
            {renderStatItem('arrow-up-bold-circle', 'Upgrade Dibeli', safeStats.totalUpgradesBought, '#8BC34A')}
            {renderStatItem('store', 'Bisnis Dibeli', safeStats.totalBusinessesBought, '#00BCD4')}
            {renderStatItem('cash-multiple', 'Penghasilan Klik', formatMoney(safeStats.totalMoneyFromClicks), '#795548')}
            {renderStatItem('cash-clock', 'Penghasilan Pasif', formatMoney(safeStats.totalMoneyFromBusinesses), '#9E9E9E')}
          </View>
        </View>
        
        {/* Detail Upgrade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Upgrade</Text>
          {upgrades.map((upgrade) => (
            <View key={upgrade.id} style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <MaterialCommunityIcons 
                  name={getIconName(upgrade.icon)} 
                  size={18} 
                  color="#4CAF50" 
                />
                <Text style={styles.detailTitle}>{upgrade.name}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Lvl {upgrade.level}</Text>
                </View>
              </View>
              <Text style={styles.detailDescription}>
                {upgrade.level > 0 ? 
                  `Menambahkan ${formatMoney(upgrade.moneyPerClickBonus)} per klik` : 
                  'Belum dibeli'
                }
              </Text>
            </View>
          ))}
        </View>
        
        {/* Detail Bisnis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Bisnis</Text>
          {businesses.map((business) => (
            <View key={business.id} style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <MaterialCommunityIcons 
                  name={getIconName(business.icon)} 
                  size={18} 
                  color="#FF9800" 
                />
                <Text style={styles.detailTitle}>{business.name}</Text>
                <View style={[styles.levelBadge, { backgroundColor: '#FF9800' }]}>
                  <Text style={styles.levelText}>Lvl {business.level}</Text>
                </View>
              </View>
              <Text style={styles.detailDescription}>
                {business.owned ? 
                  `Menghasilkan ${formatMoney(calculateBusinessIncome(business.baseIncomePerSecond, business.level))} per detik` : 
                  'Belum dibeli'
                }
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    position: 'absolute',
    right: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#283548',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#673AB7',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#673AB7',
    borderRadius: 5,
  },
  progressDetails: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  progressDetailText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  levelBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 26,
  },
}); 