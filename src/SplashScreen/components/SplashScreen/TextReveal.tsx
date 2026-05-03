import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import { SplashTheme } from './theme';

interface TextRevealProps {
  progress: SharedValue<number>;
}

export const TextReveal: React.FC<TextRevealProps> = ({ progress }) => {
  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.5], [0, 1], Extrapolation.CLAMP);
    const translateX = interpolate(progress.value, [0, 1], [20, 0], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Text style={styles.text}>uokka.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // Align with the Q which is vertically centered
    // Shifted to the right to sit perfectly next to the Q
    marginLeft: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 48, // Dikembalikan ke ukuran semula (besar)
    fontWeight: '700',
    color: '#A97458', // Light brown to match
    letterSpacing: 2,
    fontFamily: 'Poppins, sans-serif',
    // Efek shadow sedikit
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
});
