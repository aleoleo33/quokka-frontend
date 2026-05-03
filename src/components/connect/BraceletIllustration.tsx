import React from 'react';
import Svg, { Path, Rect, Defs, LinearGradient, Stop, G } from 'react-native-svg';

const BRAID_LEFT = [8, 20, 32, 44, 56, 68, 80, 92, 104];
const BRAID_RIGHT = [196, 208, 220, 232, 244, 256, 268, 280, 292];

export const BraceletIllustration: React.FC = () => (
  <Svg width="100%" height={90} viewBox="0 0 300 80" preserveAspectRatio="xMidYMid meet">
    <Defs>
      <LinearGradient id="bd" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#3C3C3C" />
        <Stop offset="0.45" stopColor="#1A1A1A" />
        <Stop offset="1" stopColor="#0D0D0D" />
      </LinearGradient>
      <LinearGradient id="mt" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#E0E0E0" />
        <Stop offset="0.5" stopColor="#FFFFFF" />
        <Stop offset="1" stopColor="#A0A0A0" />
      </LinearGradient>
      <LinearGradient id="usbc" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#CCCCCC" />
        <Stop offset="1" stopColor="#888888" />
      </LinearGradient>
    </Defs>

    <Rect x="0" y="28" width="112" height="24" rx="12" fill="url(#bd)" />
    {BRAID_LEFT.map(x => (
      <G key={x}>
        <Path d={`M${x} 28 L${x + 10} 52`} stroke="#404040" strokeWidth="2" strokeLinecap="round" />
        <Path d={`M${x + 10} 28 L${x} 52`} stroke="#2A2A2A" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </G>
    ))}
    <Rect x="0" y="28" width="112" height="4" rx="2" fill="#505050" opacity="0.7" />

    <Rect x="108" y="20" width="84" height="40" rx="6" fill="url(#mt)" />
    <Rect x="112" y="24" width="76" height="32" rx="4" fill="#BBBBBB" opacity="0.3" />
    <Rect x="137" y="34" width="26" height="12" rx="6" fill="#444" />
    <Rect x="141" y="37" width="18" height="6" rx="3" fill="#666" />

    <Path
      d="M155 26 C151 26 148 29 148 33 C148 37 151 40 155 40 C159 40 162 37 162 33 C162 29 159 26 155 26 Z M155 29 C157.5 29 159.5 30.8 159.5 33 C159.5 35.2 157.5 37 155 37 C152.5 37 150.5 35.2 150.5 33 C150.5 30.8 152.5 29 155 29 Z"
      fill="#888" opacity="0.5"
    />
    <Path d="M158 37 L161.5 41" stroke="#888" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

    <Rect x="188" y="28" width="112" height="24" rx="12" fill="url(#bd)" />
    {BRAID_RIGHT.map(x => (
      <G key={x}>
        <Path d={`M${x} 28 L${x + 10} 52`} stroke="#404040" strokeWidth="2" strokeLinecap="round" />
        <Path d={`M${x + 10} 28 L${x} 52`} stroke="#2A2A2A" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </G>
    ))}
    <Rect x="188" y="28" width="112" height="4" rx="2" fill="#505050" opacity="0.7" />
  </Svg>
);
