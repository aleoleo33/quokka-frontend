import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface WorkspaceCardProps {
  title: string;
  description: string;
  onPress?: () => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ title, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9} onPress={onPress}>
      <BlurView intensity={60} tint="dark" style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="view-grid-outline" size={24} color={Theme.colors.textLight} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        
        <View style={styles.decorativeGrid}>
          <View style={styles.gridRow}>
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell} />
            <View style={styles.gridCell} />
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: 'rgba(99, 79, 73, 0.4)',
    padding: Theme.spacing.xl,
    minHeight: 160,
    justifyContent: 'flex-end',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: Theme.spacing.xl,
    left: Theme.spacing.xl,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.textLight,
    marginBottom: Theme.spacing.xs,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textLight,
    opacity: 0.8,
  },
  decorativeGrid: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    opacity: 0.15,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 60,
    height: 60,
    backgroundColor: Theme.colors.textLight,
    margin: 4,
    borderRadius: Theme.borderRadius.sm,
  },
});
