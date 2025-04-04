import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameContext } from '../context/GameContext';
import { Achievement, checkAchievementCompletion } from '../constants/Achievements';
import formatMoney from '../utils/formatMoney';

const AchievementsScreen: React.FC = () => {
  const { gameState, claimAchievementReward } = useGameContext();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  
  // Update achievements status setiap kali gameState berubah
  useEffect(() => {
    if (gameState.achievements) {
      setAchievements(gameState.achievements);
      const completed = gameState.achievements.filter(a => a.isCompleted && a.isCollected).length;
      setCompletedCount(completed);
    }
  }, [gameState]);
  
  // Fungsi untuk mengklaim hadiah achievement
  const handleClaimReward = (achievementId: string) => {
    claimAchievementReward(achievementId);
    
    // Cari achievement yang diklaim untuk menampilkan alert
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
      let rewardText = '';
      
      switch (achievement.reward.type) {
        case 'money':
          rewardText = `${formatMoney(achievement.reward.value)}`;
          break;
        case 'multiplier':
          rewardText = `${(achievement.reward.value - 1) * 100}% peningkatan penghasilan`;
          break;
        case 'stamina':
          rewardText = `+${achievement.reward.value} stamina maksimum`;
          break;
        case 'experience':
          rewardText = `+${achievement.reward.value} pengalaman`;
          break;
      }
      
      Alert.alert(
        'Hadiah Diklaim!',
        `Anda mendapatkan: ${rewardText}`,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    }
  };
  
  // Fungsi untuk mendapatkan progres achievement
  const getAchievementProgress = (achievement: Achievement) => {
    const gameStats = {
      totalMoneyEarned: gameState.totalMoneyEarned,
      totalClicks: gameState.totalClicks,
      totalUpgradesBought: gameState.totalUpgradesBought,
      loginStreak: gameState.loginStreak,
      totalTimePlayed: gameState.totalTimePlayed
    };
    
    let current = 0;
    const target = achievement.requirement.value;
    
    switch (achievement.requirement.type) {
      case 'money':
        current = gameStats.totalMoneyEarned || 0;
        break;
      case 'clicks':
        current = gameStats.totalClicks || 0;
        break;
      case 'upgrades':
        current = gameStats.totalUpgradesBought || 0;
        break;
      case 'login_streak':
        current = gameStats.loginStreak || 0;
        break;
      case 'playtime':
        current = gameStats.totalTimePlayed || 0;
        break;
    }
    
    // Pastikan current tidak melebihi target
    current = Math.min(current, target);
    
    return { current, target, percentage: (current / target) * 100 };
  };
  
  // Render item achievement
  const renderAchievementItem = ({ item }: { item: Achievement }) => {
    const progress = getAchievementProgress(item);
    
    return (
      <View style={styles.achievementItem}>
        <View style={styles.achievementHeader}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={item.icon as any} size={30} color="#4CAF50" />
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.achievementTitle}>{item.title}</Text>
            <Text style={styles.achievementDescription}>{item.description}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress.percentage}%` }
              ]}
            />
          </View>
          
          <Text style={styles.progressText}>
            {item.requirement.type === 'money' 
              ? `${formatMoney(progress.current)} / ${formatMoney(progress.target)}`
              : `${progress.current} / ${progress.target}`}
          </Text>
        </View>
        
        {item.isCompleted && !item.isCollected ? (
          <TouchableOpacity
            style={styles.claimButton}
            onPress={() => handleClaimReward(item.id)}
          >
            <Text style={styles.claimButtonText}>Klaim</Text>
          </TouchableOpacity>
        ) : item.isCollected ? (
          <View style={styles.claimedBadge}>
            <MaterialCommunityIcons name="check-circle" size={18} color="#4CAF50" />
            <Text style={styles.claimedText}>Sudah Diklaim</Text>
          </View>
        ) : null}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pencapaian</Text>
        <View style={styles.headerStats}>
          <MaterialCommunityIcons name="trophy" size={20} color="#FFC107" />
          <Text style={styles.statsText}>
            {completedCount} / {achievements.length} Selesai
          </Text>
        </View>
      </View>
      
      {/* Informasi */}
      <View style={styles.infoContainer}>
        <MaterialCommunityIcons name="information" size={20} color="#3F51B5" />
        <Text style={styles.infoText}>
          Selesaikan pencapaian untuk mendapatkan hadiah istimewa!
        </Text>
      </View>
      
      {/* Daftar Achievement */}
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={renderAchievementItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57C00',
    marginLeft: 6,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EAF6',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3F51B5',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
  },
  achievementItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  achievementHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  claimButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  claimButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  claimedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
});

export default AchievementsScreen; 