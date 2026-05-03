import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Theme } from '../../theme';

interface AppTitleProps extends TextProps {
  children: React.ReactNode;
  centered?: boolean;
}

export const AppTitle: React.FC<AppTitleProps> = ({ children, centered, style, ...props }) => {
  return (
    <Text 
      style={[
        styles.title, 
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
  title: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: 'bold',
    color: Theme.colors.text,
    lineHeight: 40,
  },
  centered: {
    textAlign: 'center',
  },
});
