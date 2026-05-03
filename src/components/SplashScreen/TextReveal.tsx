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
    const translateX = interpolate(progress.value, [0, 1], [30, 0], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Text style={styles.text}>UOKKA.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: -6,
  },
  text: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#A97458',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
});

