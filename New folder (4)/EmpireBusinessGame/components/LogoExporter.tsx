import React, { useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import BusinessLogo from './BusinessLogo';

/**
 * Komponen ini hanya untuk pengembang, digunakan untuk mengekspor logo sebagai PNG
 * Tidak digunakan dalam aplikasi produksi
 */
const LogoExporter: React.FC = () => {
  const viewShotRef = useRef<ViewShot>(null);

  const exportLogo = async () => {
    if (viewShotRef.current) {
      try {
        // Ambil screenshot dari logo
        const uri = await viewShotRef.current.capture();
        
        // Tentukan path untuk menyimpan gambar
        const fileName = 'business-logo.png';
        const path = `${FileSystem.documentDirectory}${fileName}`;
        
        // Salin file ke lokasi yang dapat dibagikan
        await FileSystem.copyAsync({
          from: uri,
          to: path
        });
        
        // Bagikan file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(path);
        } else {
          console.log('Sharing tidak tersedia di perangkat ini');
        }
      } catch (error) {
        console.error('Error mengekspor logo:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
        <View style={styles.logoContainer}>
          <BusinessLogo width={512} height={512} />
        </View>
      </ViewShot>
      <Button title="Ekspor Logo sebagai PNG" onPress={exportLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
});

export default LogoExporter;

// Catatan: Untuk menggunakan komponen ini, Anda perlu menginstal:
// npm install react-native-view-shot expo-file-system expo-sharing 