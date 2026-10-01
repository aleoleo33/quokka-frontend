import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../theme';


export const ConnectScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Connect Screen</Text>
  </View>
);

export const WorkspaceScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Workspace Screen</Text>
  </View>
);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background,
  },
  text: {
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.textSecondary,
  },
});