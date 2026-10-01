import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../../theme';
import { useWorkspaceStore } from '../../store/workspaceStore';

interface FabAction {
  label: string;
  icon: string;
  bg: string;
  iconColor: string;
  onPress: () => void;
}

interface Props {
  expanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const WorkspaceFab: React.FC<Props> = ({ expanded, onToggle, onClose }) => {
  const insets = useSafeAreaInsets();
  const createNote = useWorkspaceStore(s => s.createNote);
  const createTable = useWorkspaceStore(s => s.createTable);
  const createCanvas = useWorkspaceStore(s => s.createCanvas);
  const menuAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(menuAnim, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
    onToggle();
  };

  const close = () => {
    Animated.spring(menuAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
    onClose();
  };

  const fire = (action: () => void) => {
    close();
    action();
  };

  const actions: FabAction[] = [
    { label: 'Notes', icon: 'file-document-plus-outline', bg: '#E3C8A4', iconColor: '#663B22', onPress: createNote },
    { label: 'Table', icon: 'table', bg: '#A3C4A8', iconColor: '#2A4B30', onPress: createTable },
    { label: 'Canvas', icon: 'transit-connection-variant', bg: '#A4BCE3', iconColor: '#2A3C5B', onPress: createCanvas },
  ];

  const translateY = menuAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
  const opacity = menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const scale = menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <>

      <Animated.View style={[
        styles.menuContainer,
        { opacity, transform: [{ translateY }, { scale }], pointerEvents: expanded ? 'auto' : 'none', bottom: insets.bottom + 156 },
      ]}>
        {actions.map(a => (
          <TouchableOpacity key={a.label} style={styles.menuItem} activeOpacity={0.8} onPress={() => fire(a.onPress)}>
            <View style={[styles.iconBg, { backgroundColor: a.bg }]}>
              <MaterialCommunityIcons name={a.icon as any} size={20} color={a.iconColor} />
            </View>
            <Text style={styles.menuText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <TouchableOpacity
        style={[styles.mainBtn, expanded && styles.mainBtnActive, { bottom: insets.bottom + 90 }]}
        onPress={toggle}
        activeOpacity={0.9}
      >
        <Feather name={expanded ? 'x' : 'grid'} size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 98,
    elevation: 98,
  },
  mainBtn: {
    position: 'absolute',
    right: Theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadow.float,
    zIndex: 100,
  },
  mainBtnActive: {
    backgroundColor: '#4A2A18',
    transform: [{ rotate: '90deg' }],
  },
  menuContainer: {
    position: 'absolute',
    right: Theme.spacing.lg,
    alignItems: 'flex-end',
    zIndex: 99,
    elevation: 99,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginBottom: 8,
    ...Theme.shadow.card,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    color: Theme.colors.text,
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 15,
  },
});
