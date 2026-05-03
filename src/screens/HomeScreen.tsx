import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/layout/Header';
import { TextCard } from '../components/cards/TextCard';
import { WorkspaceCard } from '../components/cards/WorkspaceCard';
import { ConnectCard } from '../components/cards/ConnectCard';
import { DataCard } from '../components/cards/DataCard';
import { Theme } from '../theme';

const { width, height } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
      </View>
      
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TextCard
          subtitle="THE TACTILE SANCTUARY"
          title="Focus on what matters."
          description="Your ecosystem is harmonized and ready for the day's tasks."
        />
        
        <WorkspaceCard
          title="Workspace"
          description="Access your active projects and tools."
          onPress={() => navigation.navigate('Workspace')}
        />
        
        <View style={styles.row}>
          <ConnectCard title="Connect" onPress={() => navigation.navigate('Connect')} />
          <DataCard title="Data" onPress={() => navigation.navigate('Data')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.bgWarm,
  },
  blobContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: -1,
  },
  blob: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    opacity: 0.5,
  },
  blob1: {
    top: -width * 0.2,
    left: -width * 0.2,
    backgroundColor: Theme.colors.cardPeach,
  },
  blob2: {
    top: height * 0.3,
    right: -width * 0.3,
    backgroundColor: '#E8D5C4',
  },
  blob3: {
    bottom: -width * 0.1,
    left: width * 0.1,
    backgroundColor: Theme.colors.circle1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
