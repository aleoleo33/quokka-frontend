import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Theme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { useWorkspaceStore, CanvasCard } from '../../store/workspaceStore';

interface Props {
  card: CanvasCard;
  canvasId: string;
}

export const CanvasElement: React.FC<Props> = ({ card, canvasId }) => {
  const updatePos = useWorkspaceStore(s => s.updateCanvasCardPos);
  const updateEl = useWorkspaceStore(s => s.updateCanvasElement);
  const connectionMode = useWorkspaceStore(s => s.connectionMode);
  const startConnection = useWorkspaceStore(s => s.startConnection);
  const completeConnection = useWorkspaceStore(s => s.completeConnection);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(card.description);
  const [showAnchors, setShowAnchors] = useState(false);
  const isSelected = useWorkspaceStore(s => s.selectedElementIds.includes(card.id));
  const setSelectedElements = useWorkspaceStore(s => s.setSelectedElements);

  const initialW = card.width || (card.type === 'text' ? 200 : card.type === 'shape' ? 120 : 150);
  const initialH = card.height || (card.type === 'text' ? 50 : card.type === 'shape' ? 80 : 150);
  const [size, setSize] = useState({ w: initialW, h: initialH });
  const [resizing, setResizing] = useState(false);

  const pan = useRef(new Animated.ValueXY({ x: card.x, y: card.y })).current;
  const panValue = useRef({ x: card.x, y: card.y });
  const startSize = useRef({ w: initialW, h: initialH });
  const stateRefs = useRef({ editing, connecting: connectionMode.active, cardId: card.id });
  stateRefs.current = { editing, connecting: connectionMode.active, cardId: card.id };

  useEffect(() => {
    const id = pan.addListener((value) => {
      panValue.current = value;
    });
    return () => pan.removeListener(id);
  }, [pan]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !stateRefs.current.editing && !stateRefs.current.connecting,
      onMoveShouldSetPanResponder: (_, gs) => !stateRefs.current.editing && !stateRefs.current.connecting,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        pan.setOffset({ x: panValue.current.x, y: panValue.current.y });
        pan.setValue({ x: 0, y: 0 });
        const state = useWorkspaceStore.getState();
        if (!state.selectedElementIds.includes(stateRefs.current.cardId)) {
          setSelectedElements([stateRefs.current.cardId]);
        }
        updateEl(stateRefs.current.cardId, { zIndex: Date.now() });
      },
      onPanResponderMove: (_, gs) => {
        pan.setValue({ x: gs.dx, y: gs.dy });
      },
      onPanResponderRelease: (e, gs) => {
        pan.flattenOffset();
        updatePos(stateRefs.current.cardId, panValue.current.x, panValue.current.y);

        // Tap detection
        if (Math.abs(gs.dx) < 5 && Math.abs(gs.dy) < 5) {
          handleTap(e);
        }
      },
    }),
  ).current;

  const resizeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        setResizing(true);
        startSize.current = { w: size.w, h: size.h };
      },
      onPanResponderMove: (_, gs) => {
        setSize({ w: Math.max(50, startSize.current.w + gs.dx), h: Math.max(50, startSize.current.h + gs.dy) });
      },
      onPanResponderRelease: (_, gs) => {
        setResizing(false);
        const w = Math.max(50, startSize.current.w + gs.dx);
        const h = Math.max(50, startSize.current.h + gs.dy);
        updateEl(stateRefs.current.cardId, { width: w, height: h });
      },
    })
  ).current;

  const onBlur = () => {
    setEditing(false);
    updateEl(card.id, { description: text });
  };

  const handleTap = (e?: any) => {
    if (connectionMode.active) {
      completeConnection(canvasId, card.id, 'top');
      return;
    }
    setShowAnchors(!showAnchors);
    setSelectedElements([card.id]);
    updateEl(card.id, { zIndex: Date.now() });
  };

  const handleDoubleTap = () => {
    if (!connectionMode.active) {
      setEditing(true);
    }
  };

  const lastTapRef = useRef(0);
  const processTap = (e: any) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      handleDoubleTap();
    } else {
      handleTap(e);
    }
    lastTapRef.current = now;
  };

  const handleStartConnect = (handle: 'top' | 'right' | 'bottom' | 'left' = 'top') => {
    startConnection(card.id, handle, 'straight');
    setShowAnchors(false);
  };

  const editableText = (style: any, placeholder: string, fullSpace?: boolean) => {
    const inputStyles = [
      style,
      fullSpace && { flex: 1, width: '100%', textAlignVertical: 'center' },
      Platform.OS === 'web' && { outlineStyle: 'none' },
      { overflow: 'hidden' as const }
    ];

    return editing ? (
      <TextInput
        style={inputStyles}
        value={text}
        onChangeText={setText}
        onBlur={onBlur}
        autoFocus
        multiline
      />
    ) : (
      <Text style={[style, { overflow: 'hidden' }]} numberOfLines={0} ellipsizeMode="clip">
        {card.description || placeholder}
      </Text>
    );
  };

  const isConnecting = connectionMode.active;
  const isSource = isConnecting && connectionMode.active && connectionMode.fromElementId === card.id;
  const isTarget = isConnecting && !isSource;

  const renderContent = () => {
    if (card.type === 'text') {
      const textStyle = {
        fontSize: card.fontSize || 16,
        fontWeight: (card.fontWeight || 'normal') as any,
        textAlign: (card.textAlign || 'left') as any,
        color: Theme.colors.text,
        fontFamily: Theme.typography.fontFamily.medium,
      };
      return (
        <View style={{ width: size.w, height: size.h, justifyContent: 'center' }}>
          {editableText(textStyle, 'Double tap to edit')}
        </View>
      );
    }

    if (card.type === 'shape') {
      const diamond = card.shapeType === 'diamond';
      const ellipse = card.shapeType === 'ellipse';
      const baseStyle = {
        ...styles.shapeBase,
        width: size.w,
        height: size.h,
        backgroundColor: card.color || '#FFFFFF',
        borderRadius: ellipse ? 1000 : 8,
        transform: [{ rotate: diamond ? '45deg' : '0deg' }] as any,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        overflow: 'hidden' as const,
        ...(isTarget ? { borderColor: Theme.colors.primary, borderWidth: 2 } : {}),
        ...(isSource ? { borderColor: '#4CAF50', borderWidth: 2 } : {}),
        ...(isSelected && !isTarget && !isSource ? { borderColor: Theme.colors.primary, borderWidth: 2 } : {}),
      };
      const innerStyle = {
        textAlign: 'center' as const,
        color: Theme.colors.text,
        fontFamily: Theme.typography.fontFamily.medium,
        width: '90%',
        paddingHorizontal: 8,
        flexShrink: 1,
      };

      return (
        <View style={baseStyle}>
          <View style={[styles.shapeInner, diamond ? { transform: [{ rotate: '-45deg' }] } : {}]}>
            {editableText(innerStyle, '...', true)}
          </View>
        </View>
      );
    }

    return (
      <View style={[
        styles.cardBox,
        {
          backgroundColor: card.color || '#FFF8E7',
          width: size.w,
          height: size.h,
          overflow: 'hidden'
        },
        isTarget ? { borderColor: Theme.colors.primary, borderWidth: 2 } : {},
        isSource ? { borderColor: '#4CAF50', borderWidth: 2 } : {},
        isSelected && !isTarget && !isSource ? { borderColor: Theme.colors.primary, borderWidth: 2 } : {},
      ]}>
        {card.type === 'card' && (
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Feather name={(card.tag as any) || 'map-pin'} size={16} color={Theme.colors.textSecondary} />
          </View>
        )}
        {editableText([styles.cardDesc, { fontSize: card.fontSize || 14, textAlign: 'center' }], '', true)}
      </View>
    );
  };

  const renderAnchors = () => {
    if (!showAnchors && !isConnecting) return null;

    const { w, h } = size;

    if (isTarget) {
      return (
        <View style={[styles.anchorOverlay, { width: w, height: h }]} pointerEvents="box-none">
          <TouchableOpacity style={[styles.anchorDotTarget, { top: -6, left: w / 2 - 6 }]} onPress={() => completeConnection(canvasId, card.id, 'top')} />
          <TouchableOpacity style={[styles.anchorDotTarget, { bottom: -6, left: w / 2 - 6 }]} onPress={() => completeConnection(canvasId, card.id, 'bottom')} />
          <TouchableOpacity style={[styles.anchorDotTarget, { top: h / 2 - 6, left: -6 }]} onPress={() => completeConnection(canvasId, card.id, 'left')} />
          <TouchableOpacity style={[styles.anchorDotTarget, { top: h / 2 - 6, right: -6 }]} onPress={() => completeConnection(canvasId, card.id, 'right')} />
        </View>
      );
    }

    if (isSource) {
      return (
        <View style={[styles.anchorOverlay, { width: w, height: h }]} pointerEvents="box-none">
          <View style={[styles.anchorDotSource, { top: -6, left: w / 2 - 6 }]} />
          <View style={[styles.anchorDotSource, { bottom: -6, left: w / 2 - 6 }]} />
          <View style={[styles.anchorDotSource, { top: h / 2 - 6, left: -6 }]} />
          <View style={[styles.anchorDotSource, { top: h / 2 - 6, right: -6 }]} />
        </View>
      );
    }

    // Show connect button when anchors visible
    return (
      <View style={[styles.anchorOverlay, { width: w, height: h }]} pointerEvents="box-none">
        <TouchableOpacity
          style={[styles.connectBtn, { top: -28, left: w / 2 - 14 }]}
          onPress={() => handleStartConnect('top')}
        >
          <Feather name="arrow-up-right" size={14} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.anchorDot, { top: -5, left: w / 2 - 5 }]} onPress={() => handleStartConnect('top')} />
        <TouchableOpacity style={[styles.anchorDot, { bottom: -5, left: w / 2 - 5 }]} onPress={() => handleStartConnect('bottom')} />
        <TouchableOpacity style={[styles.anchorDot, { top: h / 2 - 5, left: -5 }]} onPress={() => handleStartConnect('left')} />
        <TouchableOpacity style={[styles.anchorDot, { top: h / 2 - 5, right: -5 }]} onPress={() => handleStartConnect('right')} />
      </View>
    );
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: [
          { translateX: pan.x },
          { translateY: pan.y },
          { rotate: `${card.rotation || 0}deg` },
        ],
        zIndex: card.zIndex || (showAnchors || isSource || isSelected ? 100 : 1),
      }}
    >
      <View style={{ width: size.w, height: size.h }}>
        {renderContent()}
        {renderAnchors()}
      </View>

      {isSelected && !isConnecting && (
        <View
          style={[styles.resizeHandle, { left: size.w - 6, top: size.h - 6 }]}
          {...resizeResponder.panHandlers}
          pointerEvents="auto"
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shapeBase: {
    ...Theme.shadow.card,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardBox: {
    borderRadius: 8,
    padding: 16,
    ...Theme.shadow.card,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shapeInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily.semiBold,
    color: Theme.colors.text,
    flex: 1,
  },
  cardDesc: {
    fontFamily: Theme.typography.fontFamily.regular,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
  anchorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  anchorDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.primary,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  anchorDotTarget: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
    borderWidth: 2,
    borderColor: '#FFF',
    opacity: 0.9,
  },
  anchorDotSource: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  connectBtn: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    ...Theme.shadow.card,
  },
  resizeHandle: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    zIndex: 300,
    ...Theme.shadow.card,
  },
});
