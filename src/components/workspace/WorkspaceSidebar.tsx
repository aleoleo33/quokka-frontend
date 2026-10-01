import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../../theme';
import { useWorkspaceStore } from '../../store/workspaceStore';

const SIDEBAR_WIDTH = 280;
const FAVORITES = ['2024 Strategy', 'Product Roadmap'];
const PAGES = ['Engineering', 'Design Assets', 'Team Wiki'];

interface Props {
  open: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
  overlayAnim: Animated.Value;
}

export const WorkspaceSidebar: React.FC<Props> = ({ open, onClose, slideAnim, overlayAnim }) => {
  const insets = useSafeAreaInsets();
  const setActiveView = useWorkspaceStore(s => s.setActiveView);
  const createNote = useWorkspaceStore(s => s.createNote);
  const createCanvas = useWorkspaceStore(s => s.createCanvas);

  const nav = (view: 'notes' | 'canvas' | 'workspace') => {
    onClose();
    setActiveView(view);
  };

  if (!open) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View 
        style={[
          styles.panel, 
          { 
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top > 0 ? insets.top + 16 : 56,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 16,
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.label}>Personal Workspace</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={18} color={Theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.item} onPress={() => nav('notes')}>
          <Feather name="search" size={14} color={Theme.colors.textSecondary} />
          <Text style={styles.itemText}>Quick Find</Text>
        </TouchableOpacity>

        <Text style={styles.section}>FAVORITES</Text>
        {FAVORITES.map(f => (
          <TouchableOpacity key={f} style={styles.item} onPress={() => nav('notes')}>
            <Feather name="star" size={13} color={Theme.colors.textSecondary} />
            <Text style={styles.itemText}>{f}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.section}>PAGES</Text>
        {PAGES.map(p => (
          <TouchableOpacity key={p} style={styles.item} onPress={() => nav('canvas')}>
            <Feather name="file" size={13} color={Theme.colors.textSecondary} />
            <Text style={styles.itemText}>{p}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.section}>CREATE</Text>
        <TouchableOpacity style={styles.item} onPress={() => { onClose(); createNote(); }}>
          <Feather name="plus" size={13} color={Theme.colors.textSecondary} />
          <Text style={styles.itemText}>New Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { onClose(); createCanvas(); }}>
          <Feather name="layout" size={13} color={Theme.colors.textSecondary} />
          <Text style={styles.itemText}>New Canvas</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Theme.colors.overlay,
  },
  panel: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Theme.colors.bgWarm,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily.semiBold,
    color: Theme.colors.text,
  },
  closeBtn: { padding: 4 },
  section: {
    fontSize: 10,
    fontFamily: Theme.typography.fontFamily.medium,
    color: '#AAAAAA',
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 2,
  },
  itemText: {
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily.regular,
    color: Theme.colors.textSecondary,
  },
});
