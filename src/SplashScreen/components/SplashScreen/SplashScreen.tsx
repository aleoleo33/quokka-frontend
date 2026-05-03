import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import { LogoAnimation } from './LogoAnimation';
import { TextReveal } from './TextReveal';
import { SplashTheme } from './theme';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  // progress controls the logo fade, zoom, and transition to the "Q"
  const progress = useSharedValue(0);
  
  // qProgress controls the drawing of the letter "Q"
  const qProgress = useSharedValue(0);
  
  // textProgress controls the reveal and bounce of the "QUOKKA." text
  const textProgress = useSharedValue(0);

  useEffect(() => {
    // 1. Start with blank screen -> Fade in Logo -> Zoom Camera into Eye
    progress.value = withTiming(0.8, { 
      duration: SplashTheme.animation.durations.fadeIn + SplashTheme.animation.durations.zoom,
      easing: Easing.bezier(...(SplashTheme.animation.easing.smoothOut as [number, number, number, number]))
    }, (finished) => {
      if (finished) {
        // 2. Morph/Transition from Eye to Circle to Q Shape
        progress.value = withTiming(1, { 
          duration: SplashTheme.animation.durations.morph,
          easing: Easing.inOut(Easing.ease) 
        });

        // 3. Draw the "Q" stroke smoothly
        qProgress.value = withDelay(
          SplashTheme.animation.durations.morph / 2,
          withTiming(1, { 
            duration: SplashTheme.animation.durations.morph,
            easing: Easing.inOut(Easing.ease)
          })
        );

        // 4. Reveal Text with micro-bounce
        textProgress.value = withDelay(
          SplashTheme.animation.durations.morph,
          withSpring(1, SplashTheme.animation.easing.springBounce, (finished) => {
            if (finished) {
              // 5. Hold for 1.5 seconds, then finish
              setTimeout(() => {
                runOnJS(onAnimationComplete)();
              }, SplashTheme.animation.durations.hold);
            }
          })
        );
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <LogoAnimation progress={progress} qProgress={qProgress} />
      <TextReveal progress={textProgress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SplashTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
