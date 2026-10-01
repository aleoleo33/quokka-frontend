import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, Marker, Polygon } from 'react-native-svg';
import { CanvasArrow as ArrowData, useWorkspaceStore } from '../../store/workspaceStore';

interface Props {
  arrow: ArrowData;
}

export const CanvasArrowFallback: React.FC<Props> = ({ arrow }) => {
  const getResolvedArrow = useWorkspaceStore(s => s.getResolvedArrow);
  const resolved = getResolvedArrow(arrow);

  const { fromX, fromY, toX, toY } = resolved;

  const padding = 50;
  const minX = Math.min(fromX, toX) - padding;
  const minY = Math.min(fromY, toY) - padding;
  const maxX = Math.max(fromX, toX) + padding;
  const maxY = Math.max(fromY, toY) + padding;
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);

  const startX = fromX - minX;
  const startY = fromY - minY;
  const endX = toX - minX;
  const endY = toY - minY;

  let pathData = `M ${startX} ${startY} L ${endX} ${endY}`;

  if (arrow.type === 'curved') {
    if (arrow.sourceHandle === 'right' || arrow.sourceHandle === 'left') {
      pathData = `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`;
    } else {
      pathData = `M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${(startY + endY) / 2}, ${endX} ${endY}`;
    }
  } else if (arrow.type === 'elbow') {
    if (arrow.sourceHandle === 'top' || arrow.sourceHandle === 'bottom') {
      const midY = (startY + endY) / 2;
      pathData = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
    } else {
      const midX = (startX + endX) / 2;
      pathData = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
    }
  }

  return (
    <View style={[StyleSheet.absoluteFill, { left: minX, top: minY, width, height }]} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <Marker
            id={`arrowhead-${arrow.id}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <Polygon points="0 0, 10 5, 0 10" fill={arrow.color} />
          </Marker>
        </Defs>
        <Path
          d={pathData}
          stroke={arrow.color}
          strokeWidth="2"
          fill="none"
          markerEnd={`url(#arrowhead-${arrow.id})`}
        />
      </Svg>
    </View>
  );
};
