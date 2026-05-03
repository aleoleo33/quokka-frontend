import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
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
  const progress = useSharedValue(0);
  const textProgress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { 
      duration: 2000,
      easing: Easing.linear, 
    }, (finished1) => {
      if (finished1) {
        progress.value = withTiming(2, { 
          duration: 1000,
          easing: Easing.in(Easing.ease),
        }, (finished2) => {
          if (finished2) {
            progress.value = withTiming(3, { 
              duration: 1200,
              easing: Easing.out(Easing.exp),
            }, (finished3) => {
              if (finished3) {
                textProgress.value = withSpring(1, SplashTheme.animation.easing.springBounce, (finished4) => {
                  if (finished4) {
                    setTimeout(() => {
                      runOnJS(onAnimationComplete)();
                    }, SplashTheme.animation.durations.hold);
                  }
                });
              }
            });
          }
        });
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        <LogoAnimation progress={progress} />
        <View style={styles.textWrapper}>
          <TextReveal progress={textProgress} />
        </View>
      </View>
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
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    marginLeft: -15,
    marginTop: 45,
  }
});
