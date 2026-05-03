import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, Marker, Polygon } from 'react-native-svg';
import { CanvasArrow as ArrowData } from '../../store/workspaceStore';

interface Props {
  arrow: ArrowData;
}

export const CanvasArrowElement: React.FC<Props> = ({ arrow }) => {
  const minX = Math.min(arrow.fromX, arrow.toX) - 20;
  const minY = Math.min(arrow.fromY, arrow.toY) - 20;
  const width = Math.abs(arrow.toX - arrow.fromX) + 40;
  const height = Math.abs(arrow.toY - arrow.fromY) + 40;

  const fx = arrow.fromX - minX;
  const fy = arrow.fromY - minY;
  const tx = arrow.toX - minX;
  const ty = arrow.toY - minY;

  const markerId = `arrowhead-${arrow.id}`;

  let pathD = '';
  if (arrow.type === 'straight') {
    pathD = `M ${fx} ${fy} L ${tx} ${ty}`;
  } else if (arrow.type === 'curved') {
    const cx1 = fx + (tx - fx) * 0.3;
    const cy1 = fy - 40;
    const cx2 = fx + (tx - fx) * 0.7;
    const cy2 = ty + 40;
    pathD = `M ${fx} ${fy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`;
  } else {
    const midX = fx + (tx - fx) / 2;
    pathD = `M ${fx} ${fy} L ${midX} ${fy} L ${midX} ${ty} L ${tx} ${ty}`;
  }

  return (
    <View style={[styles.arrowWrap, { left: minX, top: minY, width, height }]} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <Marker id={markerId} markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <Polygon points="0,0 10,4 0,8" fill={arrow.color} />
          </Marker>
        </Defs>
        <Path
          d={pathD}
          stroke={arrow.color}
          strokeWidth={2}
          fill="none"
          strokeDasharray={arrow.type === 'elbow' ? '6,3' : undefined}
          markerEnd={`url(#${markerId})`}
        />
      </Svg>
    </View>
  );
};

export const CanvasArrowFallback: React.FC<Props> = ({ arrow }) => {
  const dx = arrow.toX - arrow.fromX;
  const dy = arrow.toY - arrow.fromY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const dotSize = 4;
  const dotCount = Math.max(Math.floor(length / 12), 3);

  const labelMap: Record<string, string> = {
    straight: '→',
    curved: '⟶',
    elbow: '⇢',
  };

  if (arrow.type === 'straight') {
    return (
      <View
        style={[
          styles.lineBase,
          {
            left: arrow.fromX,
            top: arrow.fromY - 1,
            width: length,
            transform: [{ rotate: `${angle}deg` }],
            transformOrigin: '0 50%',
          },
        ]}
      >
        <View style={[styles.solidLine, { backgroundColor: arrow.color }]} />
        <View style={[styles.arrowTip, { borderLeftColor: arrow.color }]} />
      </View>
    );
  }

  if (arrow.type === 'curved') {
    return (
      <View
        style={[
          styles.lineBase,
          {
            left: arrow.fromX,
            top: arrow.fromY - 8,
            width: length,
            height: 20,
            transform: [{ rotate: `${angle}deg` }],
            transformOrigin: '0 50%',
          },
        ]}
      >
        <View style={[styles.curvedLine, { borderColor: arrow.color }]} />
        <View style={[styles.arrowTip, { borderLeftColor: arrow.color, position: 'absolute', right: 0, top: 6 }]} />
      </View>
    );
  }

  const midX = arrow.fromX + dx / 2;
  return (
    <>
      <View style={[styles.elbowSegment, {
        left: arrow.fromX, top: arrow.fromY - 1,
        width: Math.abs(midX - arrow.fromX), height: 2,
        backgroundColor: arrow.color,
      }]} />
      <View style={[styles.elbowSegment, {
        left: midX - 1, top: Math.min(arrow.fromY, arrow.toY),
        width: 2, height: Math.abs(dy),
        backgroundColor: arrow.color,
      }]} />
      <View style={[styles.elbowSegment, {
        left: midX, top: arrow.toY - 1,
        width: Math.abs(arrow.toX - midX), height: 2,
        backgroundColor: arrow.color,
      }]} />
      <View style={[styles.arrowTip, {
        position: 'absolute',
        left: arrow.toX - 8,
        top: arrow.toY - 5,
        borderLeftColor: arrow.color,
      }]} />
    </>
  );
};

const styles = StyleSheet.create({
  arrowWrap: {
    position: 'absolute',
  },
  lineBase: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  solidLine: {
    flex: 1,
    height: 2,
  },
  curvedLine: {
    flex: 1,
    height: 16,
    borderWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 100,
    borderColor: '#754C34',
  },
  arrowTip: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#754C34',
  },
  elbowSegment: {
    position: 'absolute',
  },
});
