import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Abaikan peringatan tertentu di development mode
LogBox.ignoreLogs([
  'Remote debugger',
  'Reanimated 2',
  'AsyncStorage has been extracted',
]);

// Tetap tampilkan splash screen hingga siap render
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Sembunyikan splash screen setelah aplikasi siap
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    
    hideSplash();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
} 