import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { AppTitle } from '../components/typography/AppTitle';
import { AppDescription } from '../components/typography/AppDescription';
import { AppButton } from '../components/buttons/AppButton';
import { ConcentricCircles } from '../components/animations/ConcentricCircles';
import { Theme } from '../theme';

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const handleConnect = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppTitle style={styles.title}>Welcome To{'\n'}Quokka.</AppTitle>
          <AppDescription>Tap your bracelet to get started</AppDescription>
        </View>

        <View style={styles.animationContainer}>
          <ConcentricCircles />
        </View>

        <View style={styles.footer}>
          <AppButton label="Connect" onPress={handleConnect} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    padding: Theme.spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: Theme.spacing.xxl,
  },
  title: {
    marginBottom: Theme.spacing.sm,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
});
