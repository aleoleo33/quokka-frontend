import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../../theme';

interface Props {
  path: string[];
  onNavigateBack: () => void;
}

export const Breadcrumbs: React.FC<Props> = ({ path, onNavigateBack }) => (
  <View style={styles.container}>
    {path.map((item, i) => (
      <React.Fragment key={i}>
        <TouchableOpacity
          onPress={() => i === 0 ? onNavigateBack() : null}
          disabled={i === path.length - 1}
        >
          <Text style={[styles.text, i === path.length - 1 && styles.active]}>
            {item}
          </Text>
        </TouchableOpacity>
        {i < path.length - 1 && (
          <Feather name="chevron-right" size={16} color={Theme.colors.textSecondary} style={styles.chevron} />
        )}
      </React.Fragment>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  text: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
  active: {
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.text,
  },
  chevron: {
    marginHorizontal: Theme.spacing.xs,
  },
});
