import React from 'react';
import { Stack, Tabs } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GameProvider } from '../contexts/GameContext';
import { View } from 'react-native';
import NotificationContainer from '../components/Notifications';
import { StatusBar } from 'expo-status-bar';

// Fungsi untuk mendapatkan nama ikon yang valid
const getIconName = (iconName: string): any => {
  return iconName as any;
};

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        <Tabs screenOptions={{
          tabBarActiveTintColor: '#FF9500',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#1C1C1E' },
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}>
          <Tabs.Screen 
            name="index" 
            options={{
              title: 'Game',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons 
                  name={getIconName('cash')} 
                  color={color} 
                  size={size} 
                />
              ),
            }} 
          />
          <Tabs.Screen 
            name="stats" 
            options={{
              title: 'Statistics',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons 
                  name={getIconName('chart-bar')} 
                  color={color} 
                  size={size} 
                />
              ),
            }} 
          />
          <Tabs.Screen
            name="about"
            options={{
              title: 'Tentang',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="information-outline" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
        <NotificationContainer />
      </View>
    </GameProvider>
  );
}
