import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../../theme';
import { Breadcrumbs } from './Breadcrumbs';

interface Props {
  onBack: () => void;
}

export const UploadView: React.FC<Props> = ({ onBack }) => (
  <View>
    <Breadcrumbs path={['Cloud Storage', 'Upload File']} onNavigateBack={onBack} />

    <View style={styles.dropZone}>
      <View style={styles.iconWrap}>
        <Feather name="upload-cloud" size={48} color={Theme.colors.primary} />
      </View>
      <Text style={styles.title}>Tap to select files</Text>
      <Text style={styles.subtitle}>or drag and drop here</Text>
      <Text style={styles.meta}>Supports JPG, PNG, PDF, DOCX, up to 50MB</Text>
      <TouchableOpacity style={styles.browseBtn} activeOpacity={0.8}>
        <Text style={styles.browseBtnText}>Browse Files</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.sectionTitle}>RECENT UPLOADS</Text>

    <View style={styles.uploadingItem}>
      <View style={styles.uploadingIcon}>
        <MaterialCommunityIcons name="file-pdf-box" size={24} color="#D32F2F" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.fileName}>Design_Brief_Q4.pdf</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65%</Text>
        </View>
      </View>
      <TouchableOpacity style={{ padding: Theme.spacing.sm, marginLeft: Theme.spacing.sm }}>
        <Feather name="x" size={16} color={Theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>

    <View style={styles.fileItem}>
      <View style={[styles.fileIcon, { backgroundColor: '#E8F5E9' }]}>
        <MaterialCommunityIcons name="image" size={24} color="#4CAF50" />
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.fileName}>Hero_Banner_Draft.png</Text>
        <Text style={styles.fileMeta}>2.4 MB  •  Uploaded just now</Text>
      </View>
      <Feather name="check-circle" size={18} color="#4CAF50" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  dropZone: {
    borderWidth: 2,
    borderColor: '#E0DDD8',
    borderStyle: 'dashed',
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F7',
    marginBottom: Theme.spacing.xl,
    marginTop: Theme.spacing.md,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0EBE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  meta: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 12,
    color: '#999',
    marginBottom: Theme.spacing.lg,
  },
  browseBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
  },
  browseBtnText: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.sizes.sm,
    color: '#FFF',
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  uploadingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  uploadingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  fileName: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: Theme.colors.border,
    borderRadius: 3,
    marginRight: Theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 12,
    color: Theme.colors.primary,
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
  fileMeta: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.sizes.xs,
    color: Theme.colors.textSecondary,
  },
});
