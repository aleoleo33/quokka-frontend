import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../../theme';

interface Props {
  onMenuPress?: () => void;
}

export const Header: React.FC<Props> = ({ onMenuPress }) => (
  <View style={styles.container}>
    <Image
      source={require('../../../assets/Group 13.png')}
      style={styles.logo}
      resizeMode="contain"
    />
    <Text style={styles.title}>Quokka.</Text>
    {onMenuPress ? (
      <TouchableOpacity style={styles.action} onPress={onMenuPress}>
        <Feather name="more-vertical" size={24} color={Theme.colors.text} />
      </TouchableOpacity>
    ) : (
      <View style={styles.spacer} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    marginTop: Theme.spacing.xs,
    ...Theme.shadow.float,
  },
  logo: { width: 36, height: 36 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: Theme.typography.sizes.lg,
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.primary,
  },
  spacer: { width: 36 },
  action: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
