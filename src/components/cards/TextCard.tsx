import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Theme } from '../../theme';

interface TextCardProps {
  subtitle: string;
  title: string;
  description: string;
}

export const TextCard: React.FC<TextCardProps> = ({ subtitle, title, description }) => {
  return (
    <BlurView intensity={50} tint="light" style={styles.card}>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.xl,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
    lineHeight: 32,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
});
