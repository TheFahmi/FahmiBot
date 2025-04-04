import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Linking, TouchableOpacity, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameContext } from '../contexts/GameContext';
import { showInfoNotification } from '../utils/notifications';
import BusinessLogo from '../components/BusinessLogo';

export default function AboutScreen() {
  const { resetGame, saveGame } = useGameContext();
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);

  const handleResetGame = async () => {
    setConfirmResetVisible(false);
    resetGame();
    await saveGame();
    showInfoNotification('Permainan telah direset!', 'restart', 2000);
  };

  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tentang Permainan</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <BusinessLogo width={120} height={120} />
          </View>
          <Text style={styles.gameName}>Empire Business Game</Text>
          <Text style={styles.version}>Versi 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.sectionText}>
            Empire Business Game adalah permainan idle/incremental dimana kamu membangun kerajaan bisnis dengan menghasilkan uang, 
            membeli upgrade, dan mengelola bisnis yang menghasilkan pendapatan pasif.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cara Bermain</Text>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="hand-coin-outline" size={24} color="#4CAF50" style={styles.featureIcon} />
            <Text style={styles.featureText}>Tap pada layar untuk menghasilkan uang</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="shopping-outline" size={24} color="#4CAF50" style={styles.featureIcon} />
            <Text style={styles.featureText}>Beli upgrade untuk meningkatkan pendapatan per-tap</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="store-outline" size={24} color="#4CAF50" style={styles.featureIcon} />
            <Text style={styles.featureText}>Kelola bisnis untuk pendapatan pasif</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="chart-line" size={24} color="#4CAF50" style={styles.featureIcon} />
            <Text style={styles.featureText}>Lacak statistik dan perkembangan permainanmu</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitur</Text>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="#4CAF50" style={styles.featureIcon} />
            <Text style={styles.featureText}>Auto-save: Progres permainan disimpan otomatis</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="#4CAF50" style={styles.featureIcon} />
            <Text style={styles.featureText}>Penghasilan offline: Bisnis tetap menghasilkan saat kamu tidak bermain</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="#4CAF50" style={styles.featureIcon} />
            <Text style={styles.featureText}>Statistik lengkap untuk melacak kemajuan permainan</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={() => setConfirmResetVisible(true)}
        >
          <Text style={styles.resetButtonText}>Reset Permainan</Text>
        </TouchableOpacity>

        <View style={styles.attribution}>
          <Text style={styles.attributionText}>
            Dibuat dengan ❤️ menggunakan React Native dan Expo
          </Text>
          <Text style={styles.copyrightText}>
            © 2023 Empire Business Game
          </Text>
        </View>
      </ScrollView>

      {/* Konfirmasi Reset Dialog */}
      <Modal
        visible={confirmResetVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmResetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="alert-circle" size={32} color="#DC2626" />
              <Text style={styles.modalTitle}>Konfirmasi Reset</Text>
            </View>
            <Text style={styles.modalText}>
              Anda yakin ingin mereset semua progres permainan? Tindakan ini tidak dapat dibatalkan.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setConfirmResetVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleResetGame}
              >
                <Text style={styles.confirmButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(31, 41, 55, 0.7)',
    borderRadius: 12,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  gameName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#D1D5DB',
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  attribution: {
    marginTop: 16,
    alignItems: 'center',
  },
  attributionText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#DC2626',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 