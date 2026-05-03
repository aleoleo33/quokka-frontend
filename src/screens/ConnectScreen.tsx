import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { Theme } from '../theme';
import { Header } from '../components/layout/Header';
import { Feather } from '@expo/vector-icons';
import { BraceletIllustration } from '../components/connect/BraceletIllustration';
import { PulseDot } from '../components/connect/PulseDot';
import { SettingRow } from '../components/connect/SettingRow';

const ACTIONS = [
  { icon: 'bell' as const, label: 'Find Band' },
  { icon: 'refresh-cw' as const, label: 'Sync' },
  { icon: 'power' as const, label: 'Restart' },
];

export const ConnectScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>connect.</Text>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <View style={styles.dotWrap}>
              <PulseDot />
              <View style={styles.greenDot} />
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

        <Text style={styles.section}>SETTINGS</Text>
        <View style={styles.card}>
          <SettingRow
            icon="bell"
            label="Notifications"
            sublabel="Mirror phone alerts"
            right={<Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#E0E0E0', true: Theme.colors.primary }} thumbColor="#FFF" />}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="refresh-cw"
            label="Auto Sync"
            sublabel="Every 5 minutes"
            right={<Switch value={autoSync} onValueChange={setAutoSync} trackColor={{ false: '#E0E0E0', true: Theme.colors.primary }} thumbColor="#FFF" />}
          />
          <View style={styles.divider} />
          <SettingRow icon="moon" label="Do Not Disturb" />
          <View style={styles.divider} />
          <SettingRow icon="watch" label="Display Settings" />
        </View>

        <Text style={styles.section}>DEVICE INFO</Text>
        <View style={styles.card}>
          <SettingRow icon="cpu" label="Firmware" sublabel="v2.1.4 (up to date)" right={<View />} />
          <View style={styles.divider} />
          <SettingRow icon="hash" label="Serial Number" sublabel="QB01-2024-00491" right={<View />} />
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7}>
            <SettingRow icon="trash-2" label="Unpair Device" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.colors.bg },
  content: { paddingHorizontal: Theme.spacing.lg, paddingBottom: 100 },
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
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.colors.success },
  badgeText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 12,
    color: Theme.colors.successText,
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
  divider: { height: 1, backgroundColor: '#F5F2EF', marginLeft: 48 },
});
