import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../theme';
import { Header } from '../components/layout/Header';
import { Feather } from '@expo/vector-icons';
import { BraceletIllustration } from '../components/connect/BraceletIllustration';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

const ACTIONS: { icon: FeatherIconName; label: string }[] = [
  { icon: 'bell', label: 'Find Band' },
  { icon: 'refresh-cw', label: 'Sync' },
  { icon: 'power', label: 'Restart' },
];

export const ConnectScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [batteryLevel] = useState(86);
  const [signalStrength] = useState('Strong');
  const [lastSync] = useState('2 min ago');

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}> 
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}> 
        <Text style={styles.title}>connect.</Text>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <View style={styles.dotWrap}>
              <View style={[styles.statusDot, styles.statusDotActive]} />
            </View>
            <Text style={styles.badgeText}>Quokka Band · Connected</Text>
          </View>
        </View>

        <View style={styles.deviceCard}>
          <View style={styles.deviceHeader}>
            <Text style={styles.deviceName}>Quokka Band</Text>
            <Text style={styles.deviceModel}>Model QB-01 · USB Series</Text>
          </View>

          <View style={styles.braceletWrap}>
            <BraceletIllustration />
          </View>

          <View style={styles.metaBar}>
            <View style={styles.metaItem}>
              <Feather name="bluetooth" size={14} color={Theme.colors.primary} />
              <Text style={styles.metaText}>BLE 5.0</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={Theme.colors.primary} />
              <Text style={styles.metaText}>1m ago</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusGrid}>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>Signal</Text>
            <Text style={styles.statusValue}>{signalStrength}</Text>
            <Text style={styles.statusMeta}>Bluetooth link</Text>
          </View>
          <View style={[styles.statusCard, styles.statusCardLast]}>
            <Text style={styles.statusLabel}>Last Sync</Text>
            <Text style={styles.statusValue}>{lastSync}</Text>
            <Text style={styles.statusMeta}>Auto refresh</Text>
          </View>
        </View>

        <Text style={styles.section}>ACTIONS</Text>
        <View style={styles.actionRow}>
          {ACTIONS.map(({ icon, label }) => (
            <TouchableOpacity key={label} style={styles.actionBtn} activeOpacity={0.75}>
              <View style={styles.actionCircle}>
                <Feather name={icon} size={18} color={Theme.colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.section}>DEVICE STATUS</Text>
        <View style={styles.card}>
          <View style={styles.settingRowBase}>
            <Text style={styles.settingLabel}>Storage Used</Text>
            <Text style={styles.settingValue}>4.2 GB / 64 GB</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRowBase}>
            <Text style={styles.settingLabel}>Last Sync</Text>
            <Text style={styles.settingValue}>2 minutes ago</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRowBase}>
            <Text style={styles.settingLabel}>Sync Status</Text>
            <Text style={styles.settingValue}>Healthy</Text>
          </View>
        </View>

        <Text style={styles.section}>SETTINGS</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingSub}>Mirror phone alerts</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#E0E0E0', true: Theme.colors.primary }} thumbColor="#FFF" />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Auto Sync</Text>
              <Text style={styles.settingSub}>Every 5 minutes</Text>
            </View>
            <Switch value={autoSync} onValueChange={setAutoSync} trackColor={{ false: '#E0E0E0', true: Theme.colors.primary }} thumbColor="#FFF" />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <Text style={styles.settingLabel}>Do Not Disturb</Text>
            <Feather name="chevron-right" size={18} color={Theme.colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <Text style={styles.settingLabel}>Display Settings</Text>
            <Feather name="chevron-right" size={18} color={Theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.colors.bg },
  content: { paddingHorizontal: Theme.spacing.lg },
  title: {
    fontSize: 38,
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    marginBottom: Theme.spacing.lg,
    marginTop: -Theme.spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.successBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dotWrap: { width: 10, height: 10, alignItems: 'center', justifyContent: 'center', marginRight: 5 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.borderLight },
  statusDotActive: { backgroundColor: Theme.colors.success },
  badgeText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 12,
    color: Theme.colors.successText,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    ...Theme.shadow.subtle,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  statusLabel: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  statusValue: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 20,
    color: Theme.colors.text,
  },
  statusMeta: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 8,
  },
  statusCardLast: {
    marginRight: 0,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadow.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.md,
  },
  deviceName: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.text,
  },
  deviceModel: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  braceletWrap: {
    alignItems: 'center',
    marginVertical: Theme.spacing.lg,
    backgroundColor: Theme.colors.bgWarm,
    borderRadius: Theme.borderRadius.lg,
    paddingVertical: Theme.spacing.lg,
    overflow: 'hidden',
  },
  metaBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    alignItems: 'center',
    backgroundColor: Theme.colors.bgWarm,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: Theme.spacing.md,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 12,
    color: Theme.colors.text,
    marginLeft: 5,
  },
  section: {
    fontSize: Theme.typography.sizes.sm,
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: Theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  actionBtn: { alignItems: 'center', flex: 1 },
  actionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadow.subtle,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 6,
  },
  actionLabel: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Theme.borderRadius.xl,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  divider: { height: 1, backgroundColor: '#F5F2EF', marginLeft: 0 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  settingRowBase: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  settingLabel: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 14,
    color: Theme.colors.text,
  },
  settingSub: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  settingValue: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
});
