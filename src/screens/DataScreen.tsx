import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Header } from '../components/layout/Header';
import { Theme } from '../theme';
import { FileBrowser } from '../components/data/FileBrowser';
import { FolderView } from '../components/data/FolderView';
import { MediaGallery } from '../components/data/MediaGallery';
import { UploadView } from '../components/data/UploadView';

type DataView = 'root' | 'folder' | 'media' | 'upload';

export const DataScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<DataView>('root');
  const [storageUsed] = useState('1.8GB');
  const [uploadCount] = useState(12);
  const [cloudStatus] = useState('Good');

  const goRoot = () => setView('root');

  return (
    <KeyboardAvoidingView 
      style={[styles.safe, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Header />
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.dataSummary}>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>Storage Used</Text>
            <Text style={styles.dataValue}>{storageUsed}</Text>
            <Text style={styles.dataMeta}>Used by files & media</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>Uploads</Text>
            <Text style={styles.dataValue}>{uploadCount}</Text>
            <Text style={styles.dataMeta}>Completed this week</Text>
          </View>
          <View style={[styles.dataCard, styles.dataCardLast]}>
            <Text style={styles.dataLabel}>Cloud</Text>
            <Text style={styles.dataValue}>{cloudStatus}</Text>
            <Text style={styles.dataMeta}>Sync healthy</Text>
          </View>
        </View>

        {view === 'root' && <FileBrowser onOpenFolder={() => setView('folder')} onOpenMedia={() => setView('media')} onBack={goRoot} />}
        {view === 'folder' && <FolderView onBack={goRoot} />}
        {view === 'media' && <MediaGallery onBack={goRoot} />}
        {view === 'upload' && <UploadView onBack={goRoot} />}
      </ScrollView>

      {view !== 'upload' && (
        <TouchableOpacity style={[styles.fab, { bottom: insets.bottom + 90 }]} activeOpacity={0.8} onPress={() => setView('upload')}>
          <Feather name="upload-cloud" size={24} color="#FFF" />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.colors.bg },
  scroll: { flex: 1 },
  content: { padding: Theme.spacing.md },
  dataSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  dataCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.subtle,
  },
  dataLabel: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginBottom: 6,
  },
  dataValue: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 22,
    color: Theme.colors.text,
  },
  dataMeta: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 6,
  },
  dataCardLast: {
    marginRight: 0,
  },
  fab: {
    position: 'absolute',
    right: Theme.spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadow.float,
  },
});
