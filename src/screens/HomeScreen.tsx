import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Header } from '../components/layout/Header';
import { Theme } from '../theme';
import { useWorkspaceStore } from '../store/workspaceStore';

const { width, height } = Dimensions.get('window');

const SanctuaryIllustration = () => (
  <Svg width={160} height={150} viewBox="0 0 160 150" style={{ position: 'absolute', right: -10, bottom: -10 }}>
    <Defs>
      <RadialGradient id="g1" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} />
        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
      </RadialGradient>
      <RadialGradient id="g2" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.2} />
        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
      </RadialGradient>
    </Defs>
    <Circle cx="110" cy="90" r="72" fill="url(#g1)" />
    <Circle cx="48" cy="48" r="38" fill="url(#g2)" />
    <Circle cx="130" cy="30" r="14" fill="rgba(255,255,255,0.18)" />
    <Circle cx="20" cy="110" r="10" fill="rgba(255,255,255,0.14)" />
    <Circle cx="95" cy="18" r="7" fill="rgba(255,255,255,0.22)" />
    <Circle cx="110" cy="90" r="55" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
    <Circle cx="110" cy="90" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
    <Circle cx="60" cy="125" r="4" fill="rgba(255,255,255,0.25)" />
    <Circle cx="72" cy="130" r="2.5" fill="rgba(255,255,255,0.18)" />
    <Circle cx="55" cy="135" r="2" fill="rgba(255,255,255,0.15)" />
    <Ellipse cx="32" cy="80" rx="8" ry="18" fill="rgba(255,255,255,0.12)" transform="rotate(-30 32 80)" />
    <Ellipse cx="140" cy="55" rx="6" ry="14" fill="rgba(255,255,255,0.1)" transform="rotate(20 140 55)" />
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
          <Feather name="check" size={12} color="#FFF" />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const tasks = useWorkspaceStore(s => s.tasks) || [];
  const notes = useWorkspaceStore(s => s.notes) || [];
  const toggleTask = useWorkspaceStore(s => s.toggleTask);

  const todayTasks = tasks.filter(t => t.dueDate === 'today' && !t.completed).slice(0, 3);
  const pendingCount = tasks.filter(t => !t.completed).length;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
      </View>

      <Header />
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.dateText}>{today}</Text>
          <Text style={styles.greetingTitle}>Good Morning,</Text>
          <Text style={styles.greetingSub}>
            {pendingCount > 0
              ? `You have ${pendingCount} tasks pending for today.`
              : "Your ecosystem is harmonized and ready."}
          </Text>
        </View>

        {/* Sanctuary Banner */}
        <View style={styles.sanctuaryBanner}>
          <SanctuaryIllustration />
          <Text style={styles.sanctuaryEyebrow}>THE TACTILE SANCTUARY</Text>
          <Text style={styles.sanctuaryTitle}>Focus on what{'\n'}matters.</Text>
          <Text style={styles.sanctuaryBody}>Your ecosystem is harmonized and{' '}ready for the day's tasks.</Text>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Workspace')}>
            <View style={[styles.actionIconWrap, { backgroundColor: Theme.colors.circle1 }]}>
              <Feather name="check-square" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.actionLabel}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Workspace')}>
            <View style={[styles.actionIconWrap, { backgroundColor: Theme.colors.circle2 }]}>
              <Feather name="file-text" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.actionLabel}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Data')}>
            <View style={[styles.actionIconWrap, { backgroundColor: Theme.colors.circle3 }]}>
              <Feather name="upload-cloud" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.actionLabel}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Connect')}>
            <View style={[styles.actionIconWrap, { backgroundColor: Theme.colors.cardPeach }]}>
              <Feather name="watch" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.actionLabel}>Device</Text>
          </TouchableOpacity>
        </View>

        {/* App Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryName}>Notes</Text>
            <Text style={styles.summaryValue}>{notes.length}</Text>
            <Text style={styles.summaryMeta}>Saved ideas</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardLast]}>
            <Text style={styles.summaryName}>Tasks</Text>
            <Text style={styles.summaryValue}>{pendingCount}</Text>
            <Text style={styles.summaryMeta}>Pending today</Text>
          </View>
        </View>

        {/* Up Next Tasks */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>Up Next</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Workspace')}>
              <Text style={styles.widgetLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {todayTasks.length > 0 ? (
            <View style={styles.taskList}>
              {todayTasks.map((task, index) => (
                <View key={task.id}>
                  <View style={styles.taskRow}>
                    <Checkbox checked={task.completed} onPress={() => toggleTask(task.id)} />
                    <Text style={styles.taskTitleText} numberOfLines={1}>{task.title}</Text>
                  </View>
                  {index < todayTasks.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="coffee" size={24} color={Theme.colors.textSecondary} style={{ marginBottom: 8 }} />
              <Text style={styles.emptyStateText}>You're all caught up for today!</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
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
    padding: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
  },
  sanctuaryBanner: {
    backgroundColor: '#F49E85',
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 32,
    marginBottom: Theme.spacing.lg,
    overflow: 'hidden',
  },
  sanctuaryEyebrow: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 11,
    color: 'rgba(62, 39, 35, 0.6)',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  sanctuaryTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 32,
    color: '#3E2723',
    lineHeight: 38,
    marginBottom: 16,
  },
  sanctuaryBody: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 14,
    color: 'rgba(62, 39, 35, 0.75)',
    lineHeight: 20,
  },
  greetingSection: {
    marginBottom: Theme.spacing.xl,
    marginTop: Theme.spacing.sm,
  },
  dateText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  greetingTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 32,
    color: Theme.colors.text,
    marginBottom: 4,
  },
  greetingSub: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 15,
    color: Theme.colors.textSecondary,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Theme.shadow.subtle,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  actionLabel: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 12,
    color: Theme.colors.text,
  },
  widgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadow.card,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  widgetTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 18,
    color: Theme.colors.text,
  },
  widgetLink: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 13,
    color: Theme.colors.primary,
  },
  taskList: {
    backgroundColor: '#F9F7F5',
    borderRadius: Theme.borderRadius.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.borderLight,
    marginLeft: 46,
  },
  checkboxContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOutline: {
    width: 20,
    height: 20,
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
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  taskTitleText: {
    fontSize: 15,
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.text,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: '#F9F7F5',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.subtle,
  },
  summaryName: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  summaryValue: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 24,
    color: Theme.colors.text,
  },
  summaryMeta: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 8,
  },
  summaryCardLast: {
    marginRight: 0,
  },
});
