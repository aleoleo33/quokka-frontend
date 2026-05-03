import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import Svg, { Path, Defs, FeDropShadow, Filter } from 'react-native-svg';

interface LogoAnimationProps {
  progress: SharedValue<number>;
}

export const LogoAnimation: React.FC<LogoAnimationProps> = ({ progress }) => {
  const logoImage = require('../../../assets/Group 13.png');

  const quokkaStyle = useAnimatedStyle(() => {
    const walkCycle = Math.min(progress.value, 1) * Math.PI * 4; 
    const walkTx = Math.sin(walkCycle) * 15; 
    const walkTy = -Math.abs(Math.sin(walkCycle * 2)) * 8; 
    const walkRot = Math.sin(walkCycle) * 5;

    const zoomScale = interpolate(progress.value, [1, 2], [1, 60], Extrapolation.CLAMP);
    const zoomTx = interpolate(progress.value, [1, 2], [0, 25], Extrapolation.CLAMP);
    const zoomTy = interpolate(progress.value, [1, 2], [0, 20], Extrapolation.CLAMP);

    const opacity = interpolate(progress.value, [1.95, 2.0], [1, 0], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [
        { translateX: walkTx + zoomTx },
        { translateY: walkTy + zoomTy },
        { rotate: `${interpolate(progress.value, [1, 2], [walkRot, 0], Extrapolation.CLAMP)}deg` },
        { scale: zoomScale }
      ],
    };
  });

  const qStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, 
      [2, 3], 
      [40, 1], 
      Extrapolation.CLAMP
    );

    const opacity = interpolate(progress.value, 
      [1.95, 2.0], 
      [0, 1], 
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.container}>
      
      {/* Quokka Walking & Zooming */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, quokkaStyle]}>
        <Animated.Image 
          source={logoImage} 
          style={{ width: 150, height: 150 }} 
          resizeMode="contain" 
        />
      </Animated.View>

      {/* Q Logo Zooming Out */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, qStyle]}>
        <Svg width={180} height={180} viewBox="0 0 120 120">
          <Defs>
            <Filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <FeDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.15" />
            </Filter>
          </Defs>
          
          <Path
            d="M 60 20 C 35 20 15 40 15 65 C 15 90 35 110 60 110 C 85 110 105 90 105 65 C 105 40 85 20 60 20 Z M 60 35 C 77 35 90 48 90 65 C 90 82 77 95 60 95 C 43 95 30 82 30 65 C 30 48 43 35 60 35 Z"
            fill="#754C34"
          />
          <Path
            d="M 85 90 C 90 85 100 100 115 105 C 110 115 100 110 90 105 C 80 100 85 90 85 90 Z"
            fill="#966749"
            filter="url(#shadow)"
          />
        </Svg>
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
