import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Theme } from '../../theme';

interface AppDescriptionProps extends TextProps {
  children: React.ReactNode;
  centered?: boolean;
}

export const AppDescription: React.FC<AppDescriptionProps> = ({ children, centered, style, ...props }) => {
  return (
    <Text 
      style={[
        styles.description, 
        centered && styles.centered,
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.textSecondary,
    lineHeight: 24,
  },
  centered: {
    textAlign: 'center',
  },
});
