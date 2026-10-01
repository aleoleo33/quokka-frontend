import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient, Stop, Ellipse, Path, G } from 'react-native-svg';
import { Theme } from '../../theme';
import { useWorkspaceStore, Task } from '../../store/workspaceStore';
import { Swipeable } from 'react-native-gesture-handler';

const SimpleBannerAccent = () => (
  <Svg width={120} height={130} viewBox="0 0 120 130" style={{ position: 'absolute', right: 0, bottom: 0 }}>
    <Defs>
      <LinearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.15} />
        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
      </LinearGradient>
    </Defs>
    <Path d="M120 0 C60 0 0 60 0 130 L120 130 Z" fill="url(#accent)" />
    <Circle cx="90" cy="40" r="15" fill="rgba(255,255,255,0.08)" />
    <Circle cx="105" cy="80" r="8" fill="rgba(255,255,255,0.05)" />
  </Svg>
);

const Checkbox = ({ checked, onPress }: { checked: boolean; onPress: () => void }) => {
  const scale = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: checked ? 1 : 0,
      useNativeDriver: true,
      bounciness: 15,
    }).start();
  }, [checked]);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.checkboxContainer}>
      <View style={[styles.checkboxOutline, checked && styles.checkboxOutlineChecked]}>
        <Animated.View style={[styles.checkboxFill, { transform: [{ scale }] }]}>
          <Feather name="check" size={14} color="#FFF" />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const TaskItem = ({ task }: { task: Task }) => {
  const toggleTask = useWorkspaceStore(s => s.toggleTask);
  const deleteTask = useWorkspaceStore(s => s.deleteTask);
  const updateTask = useWorkspaceStore(s => s.updateTask);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => deleteTask(task.id)}
      >
        <Feather name="trash-2" size={20} color="#FFF" />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <View style={styles.taskRow}>
        <Checkbox checked={task.completed} onPress={() => toggleTask(task.id)} />
        {isEditing ? (
          <TextInput
            style={styles.taskInput}
            value={editTitle}
            onChangeText={setEditTitle}
            autoFocus
            onBlur={() => {
              setIsEditing(false);
              if (editTitle.trim()) updateTask(task.id, editTitle.trim());
              else setEditTitle(task.title);
            }}
            onSubmitEditing={() => {
              setIsEditing(false);
              if (editTitle.trim()) updateTask(task.id, editTitle.trim());
              else setEditTitle(task.title);
            }}
          />
        ) : (
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.taskTitleText, task.completed && styles.taskTitleCompleted]}>
              {task.title}
            </Text>
            {!task.completed && (
              <View style={[
                styles.taskTag,
                task.dueDate === 'today' ? styles.taskTagToday : styles.taskTagUpcoming
              ]}>
                <Text style={[
                  styles.taskTagText,
                  { color: task.dueDate === 'today' ? '#E64A19' : '#388E3C' }
                ]}>
                  {task.dueDate === 'today' ? 'Today' : 'Upcoming'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </Swipeable>
  );
};

export const WorkspaceDashboard: React.FC = () => {
  const setActiveView = useWorkspaceStore(s => s.setActiveView);
  const notes = useWorkspaceStore(s => s.notes) || [];
  const tables = useWorkspaceStore(s => s.tables) || [];
  const canvases = useWorkspaceStore(s => s.canvases) || [];

  const scrollRef = useRef<ScrollView>(null);

  const tasks = useWorkspaceStore(s => s.tasks) || [];
  const addTask = useWorkspaceStore(s => s.addTask);

  const hasItems = notes.length > 0 || tables.length > 0 || canvases.length > 0;

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed'>('today');

  const todayTasks = tasks.filter(t => t.dueDate === 'today' && !t.completed);
  const upcomingTasks = tasks.filter(t => t.dueDate === 'upcoming' && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), activeTab === 'completed' ? 'today' : activeTab);
      setNewTaskTitle('');
    }
    setIsAdding(false);
    Keyboard.dismiss();
  };

  const openAddTask = () => {
    setIsAdding(true);
    // Scroll to bottom after keyboard appears so input is visible
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 350);
  };

  const getVisibleTasks = () => {
    if (activeTab === 'today') return todayTasks;
    if (activeTab === 'upcoming') return upcomingTasks;
    return completedTasks;
  };

  const visibleTasks = getVisibleTasks();

  const totalCount = tasks.length;
  const completedCount = completedTasks.length;
  const progress = totalCount === 0 ? 0 : completedCount / totalCount;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <View style={styles.blobContainer} pointerEvents="none">
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>workspace!</Text>
        </View>

        <View style={styles.overviewRow}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Notes</Text>
            <Text style={styles.overviewValue}>{notes.length}</Text>
            <Text style={styles.overviewMeta}>Saved drafts</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Tables</Text>
            <Text style={styles.overviewValue}>{tables.length}</Text>
            <Text style={styles.overviewMeta}>Structured rows</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Canvases</Text>
            <Text style={styles.overviewValue}>{canvases.length}</Text>
            <Text style={styles.overviewMeta}>Visual maps</Text>
          </View>
        </View>

        <View style={styles.banner}>
          <SimpleBannerAccent />
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Good morning,</Text>
            <Text style={styles.bannerSub}>Ready to create{`\n`}something amazing?</Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressRingWrapper}>
              <Svg width={88} height={88} viewBox="0 0 100 100">
                <Defs>
                  <LinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FFE0B2" />
                    <Stop offset="100%" stopColor="#FFFFFF" />
                  </LinearGradient>
                </Defs>
              <Circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" />
              <Circle
                cx="50" cy="50" r={radius}
                  stroke="url(#progressGrad)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </Svg>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressPercent}>{Math.round(progress * 100)}</Text>
                <Text style={styles.progressUnit}>%</Text>
              </View>
            </View>
            <Text style={styles.progressLabel}>done</Text>
            <Text style={styles.progressFraction}>{completedCount} / {totalCount} tasks</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>PINNED TO DESK</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pinnedScroll}>
          {notes.map(n => (
            <TouchableOpacity key={n.id} style={styles.pinnedCard} onPress={() => setActiveView('notes', n.id)}>
              <View style={styles.cardHeaderRow}>
                <MaterialCommunityIcons name="file-document-outline" size={22} color={Theme.colors.primary} />
                <View style={[styles.cardTag, { backgroundColor: 'rgba(117, 76, 52, 0.1)' }]}>
                  <Text style={[styles.cardTagText, { color: Theme.colors.primary }]}>Active</Text>
                </View>
              </View>
              <Text style={styles.pinnedTitle} numberOfLines={2}>{n.title}</Text>
              <Text style={styles.pinnedSub}>NOTE</Text>
            </TouchableOpacity>
          ))}
          {tables.map(t => (
            <TouchableOpacity key={t.id} style={[styles.pinnedCard, { backgroundColor: '#FDF7E5' }]} onPress={() => setActiveView('table', t.id)}>
              <View style={styles.cardHeaderRow}>
                <MaterialCommunityIcons name="table" size={22} color="#8D6E63" />
                <View style={[styles.cardTag, { backgroundColor: 'rgba(141, 110, 99, 0.15)' }]}>
                  <Text style={[styles.cardTagText, { color: '#5D4037' }]}>Synced</Text>
                </View>
              </View>
              <Text style={styles.pinnedTitle} numberOfLines={2}>{t.title}</Text>
              <Text style={styles.pinnedSub}>TABLE</Text>
            </TouchableOpacity>
          ))}
          {canvases.map(c => (
            <TouchableOpacity key={c.id} style={[styles.pinnedCard, { backgroundColor: '#F0F4F8' }]} onPress={() => setActiveView('canvas', c.id)}>
              <View style={styles.cardHeaderRow}>
                <MaterialCommunityIcons name="transit-connection-variant" size={22} color="#455A64" />
                <View style={[styles.cardTag, { backgroundColor: 'rgba(69, 90, 100, 0.15)' }]}>
                  <Text style={[styles.cardTagText, { color: '#37474F' }]}>Flow</Text>
                </View>
              </View>
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
          <View style={styles.columnHeader}>
            <Text style={styles.columnTitle}>To Do Board</Text>
          </View>

          <View style={styles.tabRow}>
            {(['today', 'upcoming', 'completed'] as const).map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
                {tab !== 'completed' && (
                  <View style={[styles.badge, activeTab === tab && styles.activeBadge]}>
                    <Text style={[styles.badgeText, activeTab === tab && styles.activeBadgeText]}>
                      {tab === 'today' ? todayTasks.length : upcomingTasks.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tasksContainer}>
            {visibleTasks.length > 0 ? (
              <View style={styles.taskCardWrapper}>
                {visibleTasks.map((t, i) => (
                  <View key={t.id}>
                    <TaskItem task={t} />
                    {i < visibleTasks.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Feather name="calendar" size={24} color={Theme.colors.divider} style={{ marginBottom: 6 }} />
                <Text style={styles.emptyStateText}>No tasks here yet.</Text>
                <Text style={styles.emptyStateSubtext}>Add a new item to set up your day.</Text>
              </View>
            )}

            {isAdding ? (
              <View style={styles.inlineAddContainer}>
                <TextInput
                  style={styles.addInput}
                  placeholder={`Add to ${activeTab}...`}
                  placeholderTextColor={Theme.colors.textSecondary}
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  autoFocus
                  onSubmitEditing={handleAddTask}
                  onBlur={() => { if (!newTaskTitle.trim()) setIsAdding(false); }}
                />
                <TouchableOpacity style={styles.addSubmitBtn} onPress={handleAddTask}>
                  <Feather name="arrow-up" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addTaskBtn} onPress={openAddTask}>
                <View style={styles.addTaskBtnIcon}>
                  <Feather name="plus" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.addTaskBtnText}>New Task</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  blobContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: -1,
  },
  blob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.08,
  },
  blob1: {
    top: 50,
    right: -50,
    backgroundColor: '#F0A78F',
  },
  blob2: {
    top: 350,
    left: -80,
    backgroundColor: '#C98F73',
  },
  scroll: {
    paddingTop: Theme.spacing.md,
    paddingBottom: 110,
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    minHeight: 150,
  },
  bannerLeft: {
    flex: 1,
    paddingRight: 12,
  },

  bannerTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerSub: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 19,
  },
  progressCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  progressRingWrapper: {
    width: 88,
    height: 88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-end' as const,
    justifyContent: 'center',
  },
  progressPercent: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 26,
    color: '#FFFFFF',
    lineHeight: 30,
  },
  progressUnit: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
    marginLeft: 1,
  },
  progressLabel: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  progressFraction: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.subtle,
  },
  overviewLabel: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  overviewValue: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 22,
    color: Theme.colors.text,
  },
  overviewMeta: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 6,
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  cardTagText: {
    fontSize: 9,
    fontFamily: Theme.typography.fontFamily.semiBold,
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
    paddingHorizontal: Theme.spacing.lg,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  columnTitle: {
    fontSize: Theme.typography.sizes.xl,
    fontFamily: Theme.typography.fontFamily.semiBold,
    color: Theme.colors.text,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
    backgroundColor: '#F0EBE6',
    borderRadius: Theme.borderRadius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: Theme.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    ...Theme.shadow.subtle,
  },
  tabText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  activeTabText: {
    color: Theme.colors.text,
    fontFamily: Theme.typography.fontFamily.semiBold,
  },
  badge: {
    backgroundColor: '#E6DFD8',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  activeBadge: {
    backgroundColor: Theme.colors.primary,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.textSecondary,
  },
  activeBadgeText: {
    color: '#FFFFFF',
  },
  tasksContainer: {
    paddingBottom: Theme.spacing.xl,
  },
  emptyState: {
    padding: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.textSecondary,
    fontSize: 14,
  },
  emptyStateSubtext: {
    fontSize: 11,
    fontFamily: Theme.typography.fontFamily.regular,
    color: '#999999',
    marginTop: 2,
  },
  taskCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
    overflow: 'hidden',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.borderLight,
    marginLeft: 44,
  },
  checkboxContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOutline: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOutlineChecked: {
    borderColor: Theme.colors.primary,
  },
  checkboxFill: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  taskTitleText: {
    fontSize: 16,
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.text,
    flex: 1,
  },
  taskTitleCompleted: {
    color: Theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  taskTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  taskTagToday: {
    backgroundColor: '#FBE9E7',
  },
  taskTagUpcoming: {
    backgroundColor: '#E8F5E9',
  },
  taskTagText: {
    fontSize: 9,
    fontFamily: Theme.typography.fontFamily.semiBold,
  },
  taskInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.text,
    padding: 0,
  },
  deleteAction: {
    backgroundColor: '#E57373',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
  },
  inlineAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
  },
  addInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.text,
    height: 36,
  },
  addSubmitBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#795548',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 12,
    shadowColor: '#795548',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  addTaskBtnIcon: {
    marginRight: 6,
  },
  addTaskBtnText: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily.semiBold,
    color: '#FFFFFF',
  },
});
