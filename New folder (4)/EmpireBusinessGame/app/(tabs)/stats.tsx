import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import formatMoney from '../../utils/formatMoney';
import { useGameContext } from '../../context/GameContext';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Helper untuk format waktu
function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export default function StatsScreen() {
  const { gameState } = useGameContext();
  
  // Format tanggal terakhir login
  const lastLoginDate = new Date(gameState.lastLoginDate);
  const formattedLastLogin = lastLoginDate.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Statistik Game</Text>
        </View>
        
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistik Dasar</Text>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="cash" size={24} color="#4CAF50" />
            <View style={styles.statContent}>
              <Text style={styles.statTitle}>Total Uang</Text>
              <Text style={styles.statValue}>{formatMoney(gameState.money)}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="cash-multiple" size={24} color="#4CAF50" />
            <View style={styles.statContent}>
              <Text style={styles.statTitle}>Total Uang Dihasilkan</Text>
              <Text style={styles.statValue}>{formatMoney(gameState.totalMoneyEarned)}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="cursor-default-click" size={24} color="#2196F3" />
            <View style={styles.statContent}>
              <Text style={styles.statTitle}>Total Klik</Text>
              <Text style={styles.statValue}>{gameState.totalClicks.toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="arrow-up-bold-circle" size={24} color="#FF9800" />
            <View style={styles.statContent}>
              <Text style={styles.statTitle}>Total Upgrade Dibeli</Text>
              <Text style={styles.statValue}>{gameState.totalUpgradesBought.toLocaleString()}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistik Bermain</Text>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="timer" size={24} color="#9C27B0" />
            <View style={styles.statContent}>
              <Text style={styles.statTitle}>Total Waktu Bermain</Text>
              <Text style={styles.statValue}>{formatTime(gameState.totalTimePlayed)}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="calendar-check" size={24} color="#3F51B5" />
            <View style={styles.statContent}>
              <Text style={styles.statTitle}>Login Terakhir</Text>
              <Text style={styles.statValue}>{formattedLastLogin}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="calendar-multiple-check" size={24} color="#3F51B5" />
            <View style={styles.statContent}>
              <Text style={styles.statTitle}>Streak Login</Text>
              <Text style={styles.statValue}>{gameState.loginStreak} hari</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Prestasi</Text>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="trophy" size={24} color="#FFC107" />
            <View style={styles.statContent}>
              <Text style={styles.statTitle}>Prestasi Dibuka</Text>
              <Text style={styles.statValue}>{gameState.achievementsUnlocked} / {gameState.achievements.length}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="speedometer" size={24} color="#F44336" />
            <View style={styles.statContent}>
              <Text style={styles.statTitle}>Rekor Uang per Detik</Text>
              <Text style={styles.statValue}>{formatMoney(gameState.highestMoneyPerSecond)}/detik</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    margin: 8,
    borderRadius: 8,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statContent: {
    marginLeft: 16,
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#757575',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
}); 