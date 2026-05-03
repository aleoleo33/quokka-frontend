import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../theme';

interface AppButtonProps extends TouchableOpacityProps {
  label: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({ label, style, labelStyle, ...props }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} activeOpacity={0.75} {...props}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  label: {
    color: Theme.colors.textLight,
    fontSize: Theme.typography.sizes.md,
    fontWeight: '600',
  },
});
