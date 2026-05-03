import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface ConnectCardProps {
  title: string;
  onPress?: () => void;
}

export const ConnectCard: React.FC<ConnectCardProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8} onPress={onPress}>
      <BlurView intensity={50} tint="light" style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="access-point" size={24} color={Theme.colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginRight: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.circle1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
  },
});
