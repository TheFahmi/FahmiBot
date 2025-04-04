import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Linking
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameContext } from '../context/GameContext';
import { THEMES } from '../constants/Themes';

const SettingSection: React.FC<{
  title: string;
  icon: any;
  color: string;
  children: React.ReactNode;
}> = ({ title, icon, color, children }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name={icon} size={22} color={color} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

const SettingItem: React.FC<{
  label: string;
  value?: string;
  toggle?: boolean;
  isOn?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
}> = ({ 
  label, 
  value, 
  toggle = false, 
  isOn = false, 
  onToggle, 
  onPress 
}) => {
  if (toggle) {
    return (
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Switch
          value={isOn}
          onValueChange={onToggle}
          trackColor={{ false: '#444', true: '#4CAF5088' }}
          thumbColor={isOn ? '#4CAF50' : '#888'}
        />
      </View>
    );
  }
  
  return (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
    >
      <Text style={styles.settingLabel}>{label}</Text>
      {value ? (
        <View style={styles.settingValueContainer}>
          <Text style={styles.settingValue}>{value}</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color="#888" />
        </View>
      ) : (
        <MaterialCommunityIcons name="chevron-right" size={18} color="#888" />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const { gameState, resetGame, setActiveTheme } = useGameContext();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Mendapatkan tema yang aktif
  const activeTheme = gameState.themes.find(t => t.id === gameState.activeThemeId);
  
  // Handler untuk mengubah tema
  const handleThemeChange = () => {
    // Tampilkan daftar tema yang tersedia
    Alert.alert(
      'Pilih Tema',
      'Pilih tema untuk tampilan permainan',
      gameState.themes
        .filter(theme => theme.unlocked)
        .map(theme => ({
          text: theme.name,
          onPress: () => setActiveTheme(theme.id),
          style: theme.id === gameState.activeThemeId ? 'cancel' : 'default'
        })),
      { cancelable: true }
    );
  };
  
  // Handler konfirmasi reset game
  const handleResetGame = () => {
    Alert.alert(
      'Reset Game',
      'Anda yakin ingin mengatur ulang seluruh progres permainan? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetGame();
            Alert.alert('Game Direset', 'Semua progres permainan telah direset.');
          }
        }
      ]
    );
  };
  
  // Buka halaman privasi
  const openPrivacyPolicy = () => {
    Linking.openURL('https://www.privacypolicy.com');
  };
  
  // Tampilkan tentang aplikasi
  const showAbout = () => {
    Alert.alert(
      'Tentang Bisnis Imperium',
      'Versi 1.0.0\n\nAplikasi idle clicker game untuk mengelola bisnis virtual. Dibuat dengan React Native dan Expo.\n\n© 2023 Bisnis Imperium Team',
      [{ text: 'Tutup' }]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pengaturan</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Bagian Tampilan */}
        <SettingSection 
          title="Tampilan" 
          icon="palette" 
          color="#2196F3"
        >
          <SettingItem 
            label="Tema" 
            value={activeTheme?.name || 'Default'}
            onPress={handleThemeChange}
          />
          <SettingItem 
            label="Animasi" 
            toggle 
            isOn={true} 
            onToggle={(value) => console.log('Animation:', value)}
          />
          <SettingItem 
            label="Mode Gelap" 
            toggle 
            isOn={true} 
            onToggle={(value) => console.log('Dark Mode:', value)}
          />
        </SettingSection>
        
        {/* Bagian Suara */}
        <SettingSection 
          title="Suara & Haptic" 
          icon="volume-high" 
          color="#FF9800"
        >
          <SettingItem 
            label="Efek Suara" 
            toggle 
            isOn={soundEnabled} 
            onToggle={setSoundEnabled}
          />
          <SettingItem 
            label="Musik Latar" 
            toggle 
            isOn={false} 
            onToggle={(value) => console.log('Background Music:', value)}
          />
          <SettingItem 
            label="Haptic Feedback" 
            toggle 
            isOn={vibrationEnabled} 
            onToggle={setVibrationEnabled}
          />
        </SettingSection>
        
        {/* Bagian Notifikasi */}
        <SettingSection 
          title="Notifikasi" 
          icon="bell" 
          color="#9C27B0"
        >
          <SettingItem 
            label="Notifikasi Penghasilan" 
            toggle 
            isOn={notificationsEnabled} 
            onToggle={setNotificationsEnabled}
          />
          <SettingItem 
            label="Pengingat Harian" 
            toggle 
            isOn={false} 
            onToggle={(value) => console.log('Daily Reminder:', value)}
          />
        </SettingSection>
        
        {/* Bagian Game */}
        <SettingSection 
          title="Game" 
          icon="gamepad-variant" 
          color="#4CAF50"
        >
          <SettingItem 
            label="Statistik Permainan" 
            onPress={() => Alert.alert(
              'Statistik Permainan', 
              `Total Klik: ${gameState.totalClicks.toLocaleString()}\nTotal Uang: ${gameState.totalMoneyEarned.toLocaleString()}\nTotal Waktu: ${Math.floor(gameState.totalTimePlayed / 3600)} jam ${Math.floor((gameState.totalTimePlayed % 3600) / 60)} menit`
            )}
          />
          <SettingItem 
            label="Reset Game" 
            onPress={handleResetGame}
          />
        </SettingSection>
        
        {/* Bagian Tentang */}
        <SettingSection 
          title="Tentang" 
          icon="information" 
          color="#607D8B"
        >
          <SettingItem 
            label="Kebijakan Privasi" 
            onPress={openPrivacyPolicy}
          />
          <SettingItem 
            label="Tentang Game" 
            onPress={showAbout}
          />
          <SettingItem 
            label="Versi" 
            value="1.0.0" 
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  sectionContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  sectionContent: {
    paddingVertical: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  settingLabel: {
    fontSize: 15,
    color: '#DDDDDD',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#AAAAAA',
    marginRight: 8,
  },
}); 