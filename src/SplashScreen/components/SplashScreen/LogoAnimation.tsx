import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import Svg, { Path, Defs, FeDropShadow, Filter } from 'react-native-svg';
import { SplashTheme } from './theme';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface LogoAnimationProps {
  progress: SharedValue<number>;
  qProgress: SharedValue<number>;
}

export const LogoAnimation: React.FC<LogoAnimationProps> = ({ progress, qProgress }) => {
  // progress: 0 to 1
  // 0.0 - 0.3: fade in logo
  // 0.3 - 0.8: zoom massively into the eye
  // 0.8 - 0.9: fade out logo, fade in Q
  
  const logoImage = require('../../../Asset/IMG/Group 13.png');

  const containerStyle = useAnimatedStyle(() => {
    // Zoom massively so the eye area fills the screen
    const scale = interpolate(progress.value, [0.3, 0.8], [1, 80], Extrapolation.CLAMP);
    
    // Geser ke kanan (positif) dan ke bawah (positif) agar mata putih yang ada di kiri atas bisa ke tengah
    const translateX = interpolate(progress.value, [0.3, 0.8], [0, 45], Extrapolation.CLAMP);
    const translateY = interpolate(progress.value, [0.3, 0.8], [0, 25], Extrapolation.CLAMP);

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
      opacity: interpolate(progress.value, [0.85, 0.95], [1, 0], Extrapolation.CLAMP),
    };
  });

  const qContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0.8, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        { scale: interpolate(progress.value, [0.8, 1], [0.8, 1], Extrapolation.CLAMP) }
      ],
    };
  });

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, containerStyle]}>
        <Animated.Image 
          source={logoImage} 
          style={{ width: 150, height: 150 }} 
          resizeMode="contain" 
        />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, styles.qCenter, qContainerStyle]}>
        {/* The custom "Q" shape matching the final image */}
        <AnimatedSvg width={120} height={120} viewBox="0 0 120 120">
          <Defs>
            <Filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <FeDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.2" />
            </Filter>
          </Defs>
          {/* Main O ring of the Q */}
          <Path
            d="M 60 20 C 35 20 15 40 15 65 C 15 90 35 110 60 110 C 85 110 105 90 105 65 C 105 40 85 20 60 20 Z M 60 35 C 77 35 90 48 90 65 C 90 82 77 95 60 95 C 43 95 30 82 30 65 C 30 48 43 35 60 35 Z"
            fill="#754C34" // Darker brown
          />
          {/* The overlapping tail of the Q with shadow */}
          <Path
            d="M 85 90 C 90 85 100 100 115 105 C 110 115 100 110 90 105 C 80 100 85 90 85 90 Z"
            fill="#966749" // Lighter brown for tail
            filter="url(#shadow)"
          />
        </AnimatedSvg>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    // Menggeser Q sedikit lebih ke kiri agar tidak menabrak uokka, tapi tidak terlalu jauh
    paddingRight: 130, 
  },
});
