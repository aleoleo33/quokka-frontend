import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../../theme';
import { Breadcrumbs } from './Breadcrumbs';

const { width } = Dimensions.get('window');

const FILES = [
  { id: '1', name: 'Project_Proposal.pdf', size: '2.4 MB', modified: 'Modified Yesterday', icon: 'file-pdf-box', color: '#D32F2F' },
  { id: '2', name: 'Budget_Q4.xlsx', size: '1.1 MB', modified: 'Modified Oct 12', icon: 'file-excel-box', color: '#388E3C' },
  { id: '3', name: 'Presentation_v2.pptx', size: '8.5 MB', modified: 'Modified Oct 10', icon: 'file-powerpoint-box', color: '#E64A19' },
  { id: '4', name: 'Logo_Assets.zip', size: '15.2 MB', modified: 'Modified Sep 28', icon: 'folder-zip', color: '#7B1FA2' },
];

interface Props {
  onBack: () => void;
}

export const FolderView: React.FC<Props> = ({ onBack }) => (
  <View>
    <Breadcrumbs path={['Cloud Storage', 'Documents', 'Work Projects']} onNavigateBack={onBack} />

    <View style={styles.search}>
      <Feather name="search" size={20} color={Theme.colors.textSecondary} style={{ marginRight: Theme.spacing.sm }} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search in Work Projects..."
        placeholderTextColor={Theme.colors.textSecondary}
      />
    </View>

    <View>
      {FILES.map(file => (
        <TouchableOpacity key={file.id} style={styles.fileItem} activeOpacity={0.7}>
          <View style={[styles.fileIcon, { backgroundColor: `${file.color}15` }]}>
            <MaterialCommunityIcons name={file.icon as any} size={24} color={file.color} />
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
            <Text style={styles.fileMeta}>{file.size}  •  {file.modified}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: Theme.spacing.md,
    height: 48,
    marginBottom: Theme.spacing.xl,
  },
  searchInput: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.text,
  },
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
