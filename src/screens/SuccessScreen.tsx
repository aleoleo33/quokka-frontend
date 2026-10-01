import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Theme } from '../theme';

interface SuccessScreenProps {
  navigation: any;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ navigation }) => {
  // Entrance: badge scale
  const badgeScale    = useRef(new Animated.Value(0.4)).current;
  // Entrance: title slides down from above
  const titleY        = useRef(new Animated.Value(-30)).current;
  // Entrance: subtitle slides up from below
  const subY          = useRef(new Animated.Value(30)).current;
  // Exit: whole screen fades out
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // All text visible from the start — only positions animate
    Animated.parallel([
      // Badge pops to full size
      Animated.timing(badgeScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Title slides into place from above
      Animated.timing(titleY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      // Subtitle slides into place from below
      Animated.timing(subY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade out + navigate
    const fadeTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 4000);

    const navTimer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 4450);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>

      {/* Title — always visible, slides in from top */}
      <Animated.Text style={[styles.title, { transform: [{ translateY: titleY }] }]}>
        You're All Set.
      </Animated.Text>

      {/* Badge + glow circle */}
      <View style={styles.centerContainer}>
        <View style={styles.circleOuter} />
        <Animated.View style={[styles.badge, { transform: [{ scale: badgeScale }] }]}>
          <Svg width={120} height={120} viewBox="0 0 100 100">
            <Path
              d="M50 5 C53 5 55 8 58 9 C61 10 64 8 67 10
                C70 12 70 16 72 18 C74 20 78 21 79 24
                C80 27 78 30 79 33 C80 36 83 38 83 42
                C83 45 80 47 80 50 C80 53 83 55 83 58
                C83 62 80 64 79 67 C78 70 80 73 79 76
                C78 79 74 80 72 82 C70 84 70 88 67 90
                C64 92 61 90 58 91 C55 92 53 95 50 95
                C47 95 45 92 42 91 C39 90 36 92 33 90
                C30 88 30 84 28 82 C26 80 22 79 21 76
                C20 73 22 70 21 67 C20 64 17 62 17 58
                C17 55 20 53 20 50 C20 47 17 45 17 42
                C17 38 20 36 21 33 C22 30 20 27 21 24
                C22 21 26 20 28 18 C30 16 30 12 33 10
                C36 8 39 10 42 9 C45 8 47 5 50 5Z"
              fill="#FFFFFF"
            />
            <Path
              d="M34 51 L45 62 L67 40"
              stroke="#633C26"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Subtitle — always visible, slides in from bottom */}
      <Animated.Text style={[styles.subtitle, { transform: [{ translateY: subY }] }]}>
        Your ecosystem is now harmonized.
      </Animated.Text>

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#633C26',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 40,
  },
  centerContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  circleOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  badge: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
  },
});
