import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../../theme';

interface Props {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
}

export const SettingRow: React.FC<Props> = ({ icon, label, sublabel, right }) => (
  <View style={styles.row}>
    <View style={styles.iconWrap}>
      <Feather name={icon} size={16} color={Theme.colors.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
    </View>
    {right ?? <Feather name="chevron-right" size={16} color={Theme.colors.textSecondary} />}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#FDF5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  label: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
  },
  sublabel: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 1,
  },
});
