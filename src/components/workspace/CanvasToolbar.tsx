import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../../theme';
import { useWorkspaceStore } from '../../store/workspaceStore';

const STICKY_COLORS = ['#FDECE4', '#FFF8E7', '#E8F5E9', '#E3F2FD', '#F3E5F5', '#FFFFFF'];

const SHAPES = [
  { type: 'rectangle' as const, icon: 'square' as const },
  { type: 'diamond' as const, icon: 'hexagon' as const },
  { type: 'ellipse' as const, icon: 'circle' as const },
];

const ARROWS = [
  { type: 'straight' as const, icon: 'arrow-right' as const },
  { type: 'curved' as const, icon: 'corner-down-right' as const },
  { type: 'elbow' as const, icon: 'corner-right-down' as const },
];

interface Props {
  canvasId: string;
}

export const CanvasToolbar: React.FC<Props> = ({ canvasId }) => {
  const addElement = useWorkspaceStore(s => s.addCanvasElement);
  const addArrow = useWorkspaceStore(s => s.addCanvasArrow);
  const [menu, setMenu] = useState<'none' | 'sticky' | 'shape' | 'arrow'>('none');

  const toggle = (target: 'sticky' | 'shape' | 'arrow') =>
    setMenu(menu === target ? 'none' : target);

  const addSticky = (color: string) => {
    addElement(canvasId, 'sticky_note', { color, width: 150, height: 150, fontSize: 14 });
    setMenu('none');
  };

  const addShape = (shapeType: 'rectangle' | 'diamond' | 'ellipse') => {
    addElement(canvasId, 'shape', {
      shapeType,
      color: '#FFFFFF',
      width: 120,
      height: shapeType === 'rectangle' ? 80 : 120,
    });
    setMenu('none');
  };

  const addCanvasArrow = (arrowType: 'straight' | 'curved' | 'elbow') => {
    addArrow(canvasId, arrowType);
    setMenu('none');
  };

  const addText = () => {
    addElement(canvasId, 'text', {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'left',
      width: 200,
      height: 50,
      description: 'Double tap to edit',
    });
    setMenu('none');
  };

  return (
    <View style={styles.container}>
      {menu === 'sticky' && (
        <View style={styles.subMenu}>
          {STICKY_COLORS.map(c => (
            <TouchableOpacity key={c} style={[styles.dot, { backgroundColor: c }]} onPress={() => addSticky(c)} />
          ))}
        </View>
      )}

      {menu === 'shape' && (
        <View style={styles.subMenu}>
          {SHAPES.map(s => (
            <TouchableOpacity key={s.type} style={styles.subItem} onPress={() => addShape(s.type)}>
              <Feather name={s.icon} size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {menu === 'arrow' && (
        <View style={styles.subMenu}>
          {ARROWS.map(a => (
            <TouchableOpacity key={a.type} style={styles.subItem} onPress={() => addCanvasArrow(a.type)}>
              <Feather name={a.icon} size={24} color={Theme.colors.text} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.btn, menu === 'sticky' && styles.btnActive]}
          onPress={() => toggle('sticky')}
        >
          <Feather name="file-text" size={22} color={menu === 'sticky' ? Theme.colors.primary : Theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, menu === 'shape' && styles.btnActive]}
          onPress={() => toggle('shape')}
        >
          <Feather name="layout" size={22} color={menu === 'shape' ? Theme.colors.primary : Theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, menu === 'arrow' && styles.btnActive]}
          onPress={() => toggle('arrow')}
        >
          <Feather name="arrow-up-right" size={22} color={menu === 'arrow' ? Theme.colors.primary : Theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={addText}>
          <Feather name="type" size={22} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Theme.spacing.lg,
    top: 100,
    zIndex: 50,
    flexDirection: 'row',
  },
  toolbar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    ...Theme.shadow.card,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  btn: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnActive: {
    backgroundColor: Theme.colors.border,
  },
  subMenu: {
    position: 'absolute',
    left: 60,
    top: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    ...Theme.shadow.card,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  subItem: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
