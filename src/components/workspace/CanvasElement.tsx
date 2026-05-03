import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Theme } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { useWorkspaceStore, CanvasCard } from '../../store/workspaceStore';

interface Props {
  card: CanvasCard;
}

export const CanvasElement: React.FC<Props> = ({ card }) => {
  const updatePos = useWorkspaceStore(s => s.updateCanvasCardPos);
  const updateEl = useWorkspaceStore(s => s.updateCanvasElement);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(card.description);

  const pan = useRef(new Animated.ValueXY({ x: card.x, y: card.y })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !editing,
      onMoveShouldSetPanResponder: () => !editing,
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        updatePos(card.id, (pan.x as any)._value, (pan.y as any)._value);
      },
    }),
  ).current;

  const onBlur = () => {
    setEditing(false);
    updateEl(card.id, { description: text });
  };

  const editableText = (style: any, placeholder: string, fullSpace?: boolean) => {
    const inputStyles = [
      style,
      fullSpace && { flex: 1, width: '100%', textAlignVertical: 'center' },
      Platform.OS === 'web' && { outlineStyle: 'none' }
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
      <Text style={style}>{card.description || placeholder}</Text>
    );
  };

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
        <View style={{ width: card.width || 200, height: card.height || 50, justifyContent: 'center' }}>
          {editableText(textStyle, 'Double tap to edit')}
        </View>
      );
    }

    if (card.type === 'shape') {
      const diamond = card.shapeType === 'diamond';
      const ellipse = card.shapeType === 'ellipse';
      const baseStyle = {
        ...styles.shapeBase,
        width: card.width || 120,
        height: card.height || 80,
        backgroundColor: card.color || '#FFFFFF',
        borderRadius: ellipse ? 1000 : 8,
        transform: [{ rotate: diamond ? '45deg' : '0deg' }] as any,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      };
      const innerStyle = { 
        textAlign: 'center' as const, 
        color: Theme.colors.text, 
        fontFamily: Theme.typography.fontFamily.medium,
        width: '80%',
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
      <View style={[styles.cardBox, { backgroundColor: card.color || '#FFF8E7', width: card.width || 150, height: card.height || 150 }]}>
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
      }}
    >
      <TouchableOpacity activeOpacity={1} onLongPress={() => setEditing(true)} delayLongPress={200}>
        {renderContent()}
      </TouchableOpacity>
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
});
