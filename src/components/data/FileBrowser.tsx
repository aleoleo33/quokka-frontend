import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../../theme';
import { Breadcrumbs } from './Breadcrumbs';

const { width } = Dimensions.get('window');

interface FileItem {
  id: string;
  name: string;
  size: string;
  date?: string;
  modified?: string;
  icon: string;
  color: string;
}

const RECENT: FileItem[] = [
  { id: '1', name: 'Q3_Financial_Report_Final.pdf', size: '2.4 MB', date: 'Oct 24, 2023', icon: 'file-pdf-box', color: '#D32F2F' },
  { id: '2', name: 'Office_Interior_Mockup.jpg', size: '4.1 MB', date: 'Oct 22, 2023', icon: 'image', color: '#4CAF50' },
  { id: '3', name: 'Meeting_Notes_Team_Sync.docx', size: '856 KB', date: 'Oct 20, 2023', icon: 'file-word-box', color: '#1976D2' },
  { id: '4', name: 'User_Research_Data_Q3.csv', size: '1.2 MB', date: 'Oct 18, 2023', icon: 'file-delimited', color: '#7B1FA2' },
];

const FOLDERS = [
  { name: 'Work Projects', items: 12, icon: 'folder', color: '#1976D2', bg: '#E3F2FD' },
  { name: 'Shared Assets', items: 45, icon: 'folder-account', color: '#7B1FA2', bg: '#F3E5F5' },
  { name: 'Design System', items: 8, icon: 'folder-star', color: '#E64A19', bg: '#FBE9E7' },
  { name: 'Archives', items: 124, icon: 'folder', color: '#424242', bg: '#EEEEEE' },
];

interface Props {
  onOpenFolder: () => void;
  onOpenMedia: () => void;
  onBack: () => void;
}

export const FileBrowser: React.FC<Props> = ({ onOpenFolder, onOpenMedia, onBack }) => (
  <View>
    <Breadcrumbs path={['Cloud Storage', 'Documents']} onNavigateBack={onBack} />

    <View style={styles.grid}>
      {FOLDERS.map(f => (
        <TouchableOpacity key={f.name} style={styles.folderCard} activeOpacity={0.8} onPress={onOpenFolder}>
          <View style={[styles.folderIcon, { backgroundColor: f.bg }]}>
            <MaterialCommunityIcons name={f.icon as any} size={24} color={f.color} />
          </View>
          <Text style={styles.folderTitle}>{f.name}</Text>
          <Text style={styles.folderSub}>{f.items} items</Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text style={styles.sectionTitle}>Recent Files</Text>
    <View style={styles.list}>
      {RECENT.map(file => (
        <TouchableOpacity key={file.id} style={styles.fileItem} activeOpacity={0.7}>
          <View style={[styles.fileIcon, { backgroundColor: `${file.color}15` }]}>
            <MaterialCommunityIcons name={file.icon as any} size={24} color={file.color} />
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
            <Text style={styles.fileMeta}>{file.size}  •  {file.date}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity
      style={[styles.folderCard, { width: '100%', marginTop: Theme.spacing.xs, flexDirection: 'row', alignItems: 'center' }]}
      activeOpacity={0.8}
      onPress={onOpenMedia}
    >
      <View style={[styles.folderIcon, { backgroundColor: '#E8F5E9', marginBottom: 0, marginRight: Theme.spacing.md }]}>
        <MaterialCommunityIcons name="image-multiple" size={24} color="#388E3C" />
      </View>
      <View>
        <Text style={styles.folderTitle}>Media Library</Text>
        <Text style={styles.folderSub}>Photos & Videos</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const COL_WIDTH = (width - Theme.spacing.md * 2 - Theme.spacing.sm) / 2;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  folderCard: {
    width: COL_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#F2EFEA',
  },
  folderIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
  },
  folderTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.text,
    marginBottom: 2,
  },
  folderSub: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  list: { marginBottom: Theme.spacing.lg },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#F2EFEA',
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  fileInfo: { flex: 1, justifyContent: 'center' },
  fileName: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  fileMeta: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
  },
});
