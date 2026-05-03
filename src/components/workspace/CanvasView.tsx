import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../theme';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasElement } from './CanvasElement';
import { CanvasArrowFallback } from './CanvasArrow';

export const CanvasView: React.FC = () => {
  const docId = useWorkspaceStore(s => s.activeDocumentId);
  const canvases = useWorkspaceStore(s => s.canvases);
  const cards = useWorkspaceStore(s => s.canvasCards).filter(c => c.canvasId === docId);
  const arrows = useWorkspaceStore(s => s.canvasArrows).filter(a => a.canvasId === docId);
  const active = canvases.find(c => c.id === docId);

  if (!docId) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{active?.title || 'Canvas'}</Text>
        <Text style={styles.subtitle}>Infinite space for your ideas</Text>
      </View>

      <CanvasToolbar canvasId={docId} />

      <View style={styles.canvasWrap}>
        <View style={styles.canvasBg}>
          <View style={styles.grid} />
          {arrows.map(arrow => (
            <CanvasArrowFallback key={arrow.id} arrow={arrow} />
          ))}
          {cards.map(card => (
            <CanvasElement key={card.id} card={card} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgWarm,
  },
  header: {
    padding: Theme.spacing.lg,
    backgroundColor: 'rgba(247, 245, 242, 0.9)',
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily.regular,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  canvasWrap: { flex: 1, overflow: 'hidden' },
  canvasBg: { flex: 1, position: 'relative' },
  grid: { ...StyleSheet.absoluteFillObject, opacity: 0.05 },
});
