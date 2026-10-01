import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, PanResponder, Animated, Platform, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasElement } from './CanvasElement';
import { CanvasArrowFallback } from './CanvasArrow';

const CANVAS_SIZE = 3000;

export const CanvasView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const docId = useWorkspaceStore(s => s.activeDocumentId);
  const canvases = useWorkspaceStore(s => s.canvases);
  const cards = useWorkspaceStore(s => s.canvasCards).filter(c => c.canvasId === docId);
  const arrows = useWorkspaceStore(s => s.canvasArrows).filter(a => a.canvasId === docId);
  const active = canvases.find(c => c.id === docId);
  const connectionMode = useWorkspaceStore(s => s.connectionMode);
  const cancelConnection = useWorkspaceStore(s => s.cancelConnection);

  const scrollViewRef = useRef<ScrollView>(null);

  if (!docId) return null;

  const [selectionBox, setSelectionBox] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  // We always allow panning unless dragging an element (which blocks scroll internally)
  const isScrollEnabled = true;

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: any) => {
      // Don't intercept if user is typing in an input
      if (typeof HTMLInputElement !== 'undefined' && e.target instanceof HTMLInputElement) return;
      if (typeof HTMLTextAreaElement !== 'undefined' && e.target instanceof HTMLTextAreaElement) return;

      const state = useWorkspaceStore.getState();
      const currentDocId = state.activeDocumentId;
      if (!currentDocId) return;

      if (e.key === 'Backspace' || e.key === 'Delete') {
        const selected = state.selectedElementIds;
        if (selected.length > 0) {
          state.saveHistory(currentDocId);
          useWorkspaceStore.setState(s => ({
            canvasCards: s.canvasCards.filter(c => !selected.includes(c.id)),
            selectedElementIds: [],
          }));
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          state.redo(currentDocId);
        } else {
          state.undo(currentDocId);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        state.redo(currentDocId);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [docId]);

  const canvasPan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const canvasPanValue = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const id = canvasPan.addListener(val => { canvasPanValue.current = val; });
    return () => canvasPan.removeListener(id);
  }, [canvasPan]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        canvasPan.setOffset({ x: canvasPanValue.current.x, y: canvasPanValue.current.y });
        canvasPan.setValue({ x: 0, y: 0 });
        useWorkspaceStore.getState().clearSelection();
        if (useWorkspaceStore.getState().connectionMode.active) {
          useWorkspaceStore.getState().cancelConnection();
        }
      },
      onPanResponderMove: (_, gs) => {
        canvasPan.setValue({ x: gs.dx, y: gs.dy });
      },
      onPanResponderRelease: () => {
        canvasPan.flattenOffset();
      }
    })
  ).current;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom + 80 : 96 }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.title}
            value={active?.title || ''}
            onChangeText={(t) => useWorkspaceStore.getState().updateCanvasTitle(docId, t)}
            placeholder="Untitled Canvas"
            placeholderTextColor={Theme.colors.textSecondary}
          />
          <Text style={styles.subtitle}>Drag background to pan • Tap shapes to select/connect</Text>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Feather name={saveStatus === 'saved' ? 'check' : 'save'} size={16} color="#FFF" />
          <Text style={styles.saveBtnText}>{saveStatus === 'saved' ? 'Saved!' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <CanvasToolbar canvasId={docId} />

      <View style={styles.canvasWrap} {...panResponder.panHandlers}>
        <Animated.View
          style={[styles.canvasBg, {
            transform: [
              { translateX: canvasPan.x },
              { translateY: canvasPan.y }
            ]
          }]}
        >
          {/* Grid pattern */}
          <GridDots />

          {/* Arrows layer */}
          <View style={styles.arrowLayer} pointerEvents="none">
            {arrows.map(arrow => (
              <CanvasArrowFallback key={arrow.id} arrow={arrow} />
            ))}
          </View>

          {/* Elements layer */}
          {cards.map(card => (
            <CanvasElement key={card.id} card={card} canvasId={docId} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const GridDots: React.FC = () => {
  const dots: React.ReactNode[] = [];
  const GRID_SPACING = 40;
  const GRID_COUNT = 35;

  for (let row = 0; row < GRID_COUNT; row++) {
    for (let col = 0; col < GRID_COUNT; col++) {
      dots.push(
        <View
          key={`${row}-${col}`}
          style={{
            position: 'absolute',
            left: col * GRID_SPACING + 15,
            top: row * GRID_SPACING + 15,
            width: 2,
            height: 2,
            borderRadius: 1,
            backgroundColor: 'rgba(0,0,0,0.06)',
          }}
        />
      );
    }
  }

  return <View style={StyleSheet.absoluteFill} pointerEvents="none">{dots}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgWarm,
  },
  header: {
    padding: Theme.spacing.lg,
    backgroundColor: 'rgba(247, 245, 242, 0.95)',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Theme.typography.fontFamily.regular,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  canvasWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  canvasBg: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    position: 'relative',
    backgroundColor: '#FAFAF8',
  },
  arrowLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  scrollHint: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scrollHintBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  selectionBox: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    zIndex: 1000,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 13,
    color: '#FFF',
  },
});
