import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Theme } from '../../theme';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');
const scale = Math.min(screenWidth / 375, 1.2);
const circle1Size = 310 * scale;
const circle2Size = 250 * scale;
const circle3Size = 180 * scale;
const circle4Size = 120 * scale;

export const ConcentricCircles: React.FC = () => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.95, 1.05]) }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.97, 1.03]) }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle1, animatedStyle1]}>
        <Animated.View style={[styles.circle2, animatedStyle2]}>
          <View style={styles.circle3}>
            <View style={styles.circle4}>
              <View style={styles.iconContainer}>

                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M10 8v8M14 6v12M18 8v8"
                    stroke={Theme.colors.circle4}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                </Svg>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Theme.spacing.xl,
  },
  circle1: {
    width: circle1Size,
    height: circle1Size,
    borderRadius: circle1Size / 2,
    backgroundColor: Theme.colors.circle1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle2: {
    width: circle2Size,
    height: circle2Size,
    borderRadius: circle2Size / 2,
    backgroundColor: Theme.colors.circle2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle3: {
    width: circle3Size,
    height: circle3Size,
    borderRadius: circle3Size / 2,
    backgroundColor: Theme.colors.circle3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle4: {
    width: circle4Size,
    height: circle4Size,
    borderRadius: circle4Size / 2,
    backgroundColor: Theme.colors.circle4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48 * scale,
    height: 48 * scale,
    borderRadius: 24 * scale,
    backgroundColor: Theme.colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
