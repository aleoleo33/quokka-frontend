import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Theme } from '../../theme';
import { useWorkspaceStore } from '../../store/workspaceStore';

const TAGS = [
  { label: 'Editorial', bg: '#FDECE4', color: '#D97757' },
  { label: 'Design', bg: '#FBE8E8', color: '#9E2A2B' },
];

const TASKS = [
  { tag: TAGS[0], title: 'Draft Q3 Manifesto', desc: 'Outline the core thematic pillars...' },
  { tag: TAGS[1], title: 'Refine Quokka Tabs', desc: 'Ensure the navigation system feels seamless...' },
];

export const WorkspaceDashboard: React.FC = () => {
  const setActiveView = useWorkspaceStore(s => s.setActiveView);
  const notes = useWorkspaceStore(s => s.notes);
  const tables = useWorkspaceStore(s => s.tables);
  const canvases = useWorkspaceStore(s => s.canvases);

  const hasItems = notes.length > 0 || tables.length > 0 || canvases.length > 0;

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>workspace!</Text>
      </View>

      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Good morning,</Text>
          <Text style={styles.bannerSub}>Ready to create something amazing?</Text>
        </View>
        <Svg width={80} height={80} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.2" />
            </LinearGradient>
          </Defs>
          <Circle cx="50" cy="50" r="30" fill="url(#sg)" />
          <Circle cx="35" cy="35" r="15" fill="#FFFFFF" opacity="0.4" />
          <Circle cx="70" cy="65" r="10" fill="#FFFFFF" opacity="0.2" />
        </Svg>
      </View>

      <Text style={styles.sectionTitle}>PINNED TO DESK</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pinnedScroll}>
        {notes.map(n => (
          <TouchableOpacity key={n.id} style={styles.pinnedCard} onPress={() => setActiveView('notes', n.id)}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color={Theme.colors.text} />
            <Text style={styles.pinnedTitle} numberOfLines={2}>{n.title}</Text>
            <Text style={styles.pinnedSub}>NOTE</Text>
          </TouchableOpacity>
        ))}
        {tables.map(t => (
          <TouchableOpacity key={t.id} style={[styles.pinnedCard, { backgroundColor: '#FDF7E5' }]} onPress={() => setActiveView('table', t.id)}>
            <MaterialCommunityIcons name="table" size={24} color={Theme.colors.text} />
            <Text style={styles.pinnedTitle} numberOfLines={2}>{t.title}</Text>
            <Text style={styles.pinnedSub}>TABLE</Text>
          </TouchableOpacity>
        ))}
        {canvases.map(c => (
          <TouchableOpacity key={c.id} style={[styles.pinnedCard, { backgroundColor: '#F0F4F8' }]} onPress={() => setActiveView('canvas', c.id)}>
            <MaterialCommunityIcons name="transit-connection-variant" size={24} color={Theme.colors.text} />
            <Text style={styles.pinnedTitle} numberOfLines={2}>{c.title}</Text>
            <Text style={styles.pinnedSub}>CANVAS</Text>
          </TouchableOpacity>
        ))}
        {!hasItems && (
          <View style={styles.pinnedCard}>
            <Text style={styles.pinnedTitle}>Nothing pinned yet</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.boardContainer}>
        <View style={styles.boardColumn}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnTitle}>To Do</Text>
            <Text style={styles.columnCount}>{TASKS.length}</Text>
          </View>
          {TASKS.map((task, i) => (
            <TouchableOpacity key={i} style={styles.taskCard} onPress={() => setActiveView('notes')} activeOpacity={0.7}>
              <View style={[styles.tag, { backgroundColor: task.tag.bg }]}>
                <Text style={[styles.tagText, { color: task.tag.color }]}>{task.tag.label}</Text>
              </View>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDesc} numberOfLines={2}>{task.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingTop: Theme.spacing.md,
    paddingBottom: 100,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  screenTitle: {
    fontSize: 42,
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.text,
  },
  banner: {
    backgroundColor: Theme.colors.circle3,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    overflow: 'hidden',
  },
  bannerTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.sizes.lg,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSub: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.sm,
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.textSecondary,
    letterSpacing: 1,
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  pinnedScroll: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.lg,
  },
  pinnedCard: {
    width: 140,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    justifyContent: 'space-between',
    ...Theme.shadow.subtle,
  },
  pinnedTitle: {
    fontSize: Theme.typography.sizes.md,
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.text,
    marginTop: Theme.spacing.sm,
  },
  pinnedSub: {
    fontSize: 10,
    fontFamily: Theme.typography.fontFamily.regular,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  boardContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
  },
  boardColumn: {
    width: 280,
    marginRight: Theme.spacing.lg,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  columnTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontFamily: Theme.typography.fontFamily.semiBold,
    color: Theme.colors.text,
    marginRight: Theme.spacing.sm,
  },
  columnCount: {
    fontSize: Theme.typography.sizes.md,
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.textSecondary,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: Theme.spacing.sm,
  },
  tagText: {
    fontSize: 12,
    fontFamily: Theme.typography.fontFamily.medium,
  },
  taskTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  taskDesc: {
    fontSize: Theme.typography.sizes.sm,
    fontFamily: Theme.typography.fontFamily.regular,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: Theme.spacing.md,
  },
});
