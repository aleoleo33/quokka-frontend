import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Vibration,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../theme';

const CORRECT_PIN = '3333';
const PIN_LENGTH = 4;

const NUMPAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
];

interface PasswordScreenProps {
  navigation: any;
}

export const PasswordScreen: React.FC<PasswordScreenProps> = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const dotScales = useRef(Array.from({ length: PIN_LENGTH }, () => new Animated.Value(1))).current;

  const shake = () => {
    Vibration.vibrate(400);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start(() => {
      setError(false);
      setPin('');
    });
  };

  const animateDot = (index: number) => {
    Animated.sequence([
      Animated.spring(dotScales[index], { toValue: 1.4, useNativeDriver: true, bounciness: 20 }),
      Animated.spring(dotScales[index], { toValue: 1, useNativeDriver: true, bounciness: 10 }),
    ]).start();
  };

  const handlePress = (key: string) => {
    if (key === 'del') {
      setPin(prev => prev.slice(0, -1));
      return;
    }
    if (pin.length >= PIN_LENGTH) return;
    const newPin = pin + key;
    animateDot(pin.length);
    setPin(newPin);

    if (newPin.length === PIN_LENGTH) {
      setTimeout(() => {
        if (newPin === CORRECT_PIN) {
          navigation.navigate('Success');
        } else {
          setError(true);
          shake();
        }
      }, 200);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color={Theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.topSection}>
          <Text style={styles.title}>Enter Passcode</Text>
          <Text style={styles.subtitle}>Enter your 4-digit PIN to unlock Quokka</Text>
        </View>

        {/* PIN Dots */}
        <Animated.View style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => {
            const filled = i < pin.length;
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  filled && styles.dotFilled,
                  error && styles.dotError,
                  { transform: [{ scale: dotScales[i] }] },
                ]}
              />
            );
          })}
        </Animated.View>

        {error && <Text style={styles.errorText}>Incorrect passcode. Try again.</Text>}

        {/* Numpad */}
        <View style={styles.numpad}>
          {NUMPAD.map((row, ri) => (
            <View key={ri} style={styles.numRow}>
              {row.map((key, ki) => {
                if (key === '') return <View key={ki} style={styles.numKeyEmpty} />;
                return (
                  <TouchableOpacity
                    key={ki}
                    style={[styles.numKey, key === 'del' && styles.numKeyDel]}
                    activeOpacity={0.7}
                    onPress={() => handlePress(key)}
                  >
                    {key === 'del' ? (
                      <Feather name="delete" size={22} color={Theme.colors.text} />
                    ) : (
                      <Text style={styles.numKeyText}>{key}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Theme.colors.bgWarm,
  },
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.xl,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginTop: Theme.spacing.md,
    padding: 8,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 48,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 28,
    color: Theme.colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  dotError: {
    backgroundColor: '#E57373',
    borderColor: '#E57373',
  },
  errorText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 13,
    color: '#E57373',
    marginBottom: 8,
  },
  numpad: {
    marginTop: 40,
    width: '100%',
    maxWidth: 320,
  },
  numRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  numKey: {
    flex: 1,
    height: 72,
    marginHorizontal: 8,
    borderRadius: Theme.borderRadius.xl,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  numKeyDel: {
    backgroundColor: '#F5EDE8',
    borderColor: Theme.colors.border,
  },
  numKeyEmpty: {
    flex: 1,
    marginHorizontal: 8,
  },
  numKeyText: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: 24,
    color: Theme.colors.text,
  },
});
