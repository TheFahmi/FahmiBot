import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import formatMoney from '../utils/formatMoney';

interface MoneyDisplayProps {
  amount: number;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({ 
  amount, 
  size = 'medium', 
  showIcon = true 
}) => {
  // Menentukan ukuran teks dan ikon berdasarkan properti size
  const fontSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  
  return (
    <View style={styles.container}>
      {showIcon && (
        <MaterialCommunityIcons 
          name="cash" 
          size={iconSize} 
          color="#4CAF50" 
          style={styles.icon} 
        />
      )}
      <Text style={[styles.text, { fontSize }]}>
        {formatMoney(amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default MoneyDisplay; 