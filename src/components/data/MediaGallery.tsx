import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../../theme';

const { width } = Dimensions.get('window');
const TILE = (width - Theme.spacing.md * 2 - Theme.spacing.sm) / 2;
const FILTERS = ['All', 'Photos', 'Videos', 'Recently Added'];

interface MediaItem {
  type: 'image' | 'video';
  duration?: string;
}

const TODAY: MediaItem[] = [
  { type: 'video', duration: '0:45' },
  { type: 'image' },
  { type: 'image' },
  { type: 'image' },
];

const YESTERDAY: MediaItem[] = [
  { type: 'image' },
  { type: 'video', duration: '1:12' },
  { type: 'image' },
  { type: 'image' },
  { type: 'image' },
  { type: 'image' },
];

interface Props {
  onBack: () => void;
}

export const MediaGallery: React.FC<Props> = ({ onBack }) => {
  const [filter, setFilter] = useState('All');

  const renderTile = (item: MediaItem, i: number) => (
    <TouchableOpacity key={i} style={styles.tile} activeOpacity={0.8}>
      <MaterialCommunityIcons
        name={item.type === 'video' ? 'video-outline' : 'image-outline'}
        size={32}
        color="#A0AAB5"
      />
      {item.duration && (
        <View style={styles.duration}>
          <Feather name="play" size={10} color="#FFF" style={{ marginRight: 2 }} />
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <View style={[styles.search, { flex: 1, marginBottom: 0 }]}>
          <Feather name="search" size={20} color={Theme.colors.textSecondary} style={{ marginRight: Theme.spacing.sm }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search photos, videos..."
            placeholderTextColor={Theme.colors.textSecondary}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.pill, filter === f && styles.pillActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.pillText, filter === f && styles.pillTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.dayLabel}>Today</Text>
      <View style={styles.grid}>{TODAY.map(renderTile)}</View>

      <Text style={[styles.dayLabel, { marginTop: Theme.spacing.md }]}>Yesterday</Text>
      <View style={styles.grid}>{YESTERDAY.map(renderTile)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  backBtn: { marginRight: Theme.spacing.md },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
    borderRadius: Theme.borderRadius.full,
    paddingHorizontal: Theme.spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.text,
  },
  filterScroll: { marginBottom: Theme.spacing.xl },
  filterRow: { paddingRight: Theme.spacing.md },
  pill: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: Theme.spacing.sm,
  },
  pillActive: { backgroundColor: '#4A5568', borderColor: '#4A5568' },
  pillText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.textSecondary,
  },
  pillTextActive: { color: '#FFFFFF' },
  dayLabel: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: TILE,
    aspectRatio: 1,
    backgroundColor: '#E2E8F0',
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  duration: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: Theme.typography.fontFamily.medium,
  },
});
