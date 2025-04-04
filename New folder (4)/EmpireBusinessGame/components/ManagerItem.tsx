import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import formatMoney from '../utils/formatMoney';
import { Manager } from '../types/managerTypes';

// Definisikan tipe untuk nama ikon valid
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ManagerItemProps {
  manager: Manager;
  onHire: () => void;
  disabled?: boolean;
  businessName?: string;
}

const ManagerItem: React.FC<ManagerItemProps> = ({
  manager,
  onHire,
  disabled = false,
  businessName,
}) => {
  const cashIcon: IconName = "cash";
  const checkIcon: IconName = "check-circle";
  const managerIcon: IconName = "account-tie";

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        disabled && styles.disabled,
        manager.hired && styles.hired
      ]} 
      onPress={onHire}
      disabled={disabled || manager.hired}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons 
            name={managerIcon} 
            size={36} 
            color={manager.hired ? "#4CAF50" : "#2196F3"} 
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.name}>{manager.name}</Text>
        <Text style={styles.description}>
          {manager.description || `Mengelola ${businessName || 'bisnis'} secara otomatis`}
        </Text>
        
        {manager.hired ? (
          <View style={styles.hiredBadge}>
            <MaterialCommunityIcons name={checkIcon} size={16} color="#FFF" />
            <Text style={styles.hiredText}>Direkrut</Text>
          </View>
        ) : (
          <View style={styles.priceContainer}>
            <MaterialCommunityIcons name={cashIcon} size={18} color="#4CAF50" />
            <Text style={styles.price}>{formatMoney(manager.price)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  disabled: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
  },
  hired: {
    borderColor: '#4CAF50',
    borderWidth: 1,
    backgroundColor: '#E8F5E9',
  },
  avatarContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E1F5FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#212121',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 4,
  },
  hiredBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiredText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default ManagerItem; 