import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../theme';
import { Header } from '../components/layout/Header';
import { useWorkspaceStore } from '../store/workspaceStore';
import { NotesEditor } from '../components/workspace/NotesEditor';
import { TableView } from '../components/workspace/TableView';
import { CanvasView } from '../components/workspace/CanvasView';
import { WorkspaceDashboard } from '../components/workspace/WorkspaceDashboard';
import { WorkspaceSidebar } from '../components/workspace/WorkspaceSidebar';
import { WorkspaceFab } from '../components/workspace/WorkspaceFab';

const SIDEBAR_WIDTH = 280;

export const WorkspaceScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const activeView = useWorkspaceStore(s => s.activeView);
  const setActiveView = useWorkspaceStore(s => s.setActiveView);

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
      Animated.timing(overlayAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -SIDEBAR_WIDTH, duration: 220, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setSidebarOpen(false));
  };

  const renderView = () => {
    switch (activeView) {
      case 'notes':  return <NotesEditor />;
      case 'table':  return <TableView />;
      case 'canvas': return <CanvasView />;
      default:       return <WorkspaceDashboard />;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: activeView === 'workspace' ? insets.top : 0 }]}>
      {activeView === 'workspace' ? (
        <Header onMenuPress={openSidebar} />
      ) : (
        <View style={[styles.subHeader, { paddingTop: insets.top > 0 ? insets.top : Theme.spacing.md }]}>
          <TouchableOpacity onPress={() => setActiveView('workspace')} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={Theme.colors.text} />
            <Text style={styles.backText}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderView()}

      <WorkspaceFab
        expanded={fabOpen}
        onToggle={() => setFabOpen(!fabOpen)}
        onClose={() => setFabOpen(false)}
      />

      <WorkspaceSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        slideAnim={slideAnim}
        overlayAnim={overlayAnim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bg,
  },
  subHeader: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.bg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  backText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 14,
    color: Theme.colors.text,
    marginLeft: 6,
  },
});
