import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import BusinessScreen from '../screens/BusinessScreen';
import ManagerScreen from '../screens/ManagerScreen';
import UpgradesScreen from '../screens/UpgradesScreen';
import BoostersScreen from '../screens/BoostersScreen';
import CharactersScreen from '../screens/CharactersScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AchievementsScreen from '../screens/AchievementsScreen';

// Definisikan tipe parameter
type TabParamList = {
  Business: undefined;
  Manager: undefined;
  Upgrades: undefined;
  Boosters: undefined;
  Characters: undefined;
  Achievements: undefined;
  Settings: undefined;
};

// Buat tab navigator
const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator();

// Fungsi untuk mendapatkan ikon tab
const getTabIcon = (route: string, focused: boolean, color: string, size: number) => {
  let iconName;

  switch (route) {
    case 'Business':
      iconName = focused ? 'office-building' : 'office-building-outline';
      break;
    case 'Manager':
      iconName = focused ? 'account-tie' : 'account-tie-outline';
      break;
    case 'Upgrades':
      iconName = focused ? 'arrow-up-bold-circle' : 'arrow-up-bold-circle-outline';
      break;
    case 'Boosters':
      iconName = focused ? 'rocket-launch' : 'rocket-launch-outline';
      break;
    case 'Characters':
      iconName = focused ? 'account-group' : 'account-group-outline';
      break;
    case 'Achievements':
      iconName = focused ? 'trophy' : 'trophy-outline';
      break;
    case 'Settings':
      iconName = focused ? 'cog' : 'cog-outline';
      break;
    default:
      iconName = 'help-circle';
      break;
  }

  // @ts-ignore
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

// Fungsi untuk mendapatkan label tab dalam bahasa Indonesia
const getTabLabel = (route: string) => {
  switch (route) {
    case 'Business':
      return 'Bisnis';
    case 'Manager':
      return 'Manager';
    case 'Upgrades':
      return 'Upgrade';
    case 'Boosters':
      return 'Booster';
    case 'Characters':
      return 'Karakter';
    case 'Achievements':
      return 'Prestasi';
    case 'Settings':
      return 'Pengaturan';
    default:
      return route;
  }
};

// Komponen navigasi utama
const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => getTabIcon(route.name, focused, color, size),
          tabBarLabel: getTabLabel(route.name),
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
        })}
        initialRouteName="Characters"
      >
        <Tab.Screen name="Business" component={BusinessScreen} />
        <Tab.Screen name="Manager" component={ManagerScreen} />
        <Tab.Screen name="Upgrades" component={UpgradesScreen} />
        <Tab.Screen name="Boosters" component={BoostersScreen} />
        <Tab.Screen name="Characters" component={CharactersScreen} />
        <Tab.Screen name="Achievements" component={AchievementsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation; 