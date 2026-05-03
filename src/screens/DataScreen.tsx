import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Header } from '../components/layout/Header';
import { Theme } from '../theme';
import { FileBrowser } from '../components/data/FileBrowser';
import { FolderView } from '../components/data/FolderView';
import { MediaGallery } from '../components/data/MediaGallery';
import { UploadView } from '../components/data/UploadView';

type View = 'root' | 'folder' | 'media' | 'upload';

export const DataScreen: React.FC = () => {
  const [view, setView] = useState<View>('root');

  const goRoot = () => setView('root');

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {view === 'root' && <FileBrowser onOpenFolder={() => setView('folder')} onOpenMedia={() => setView('media')} onBack={goRoot} />}
        {view === 'folder' && <FolderView onBack={goRoot} />}
        {view === 'media' && <MediaGallery onBack={goRoot} />}
        {view === 'upload' && <UploadView onBack={goRoot} />}
      </ScrollView>

      {view !== 'upload' && (
        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setView('upload')}>
          <Feather name="upload-cloud" size={24} color="#FFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.colors.bg },
  scroll: { flex: 1 },
  content: { padding: Theme.spacing.md, paddingBottom: 100 },
  fab: {
    position: 'absolute',
    bottom: 24,
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
