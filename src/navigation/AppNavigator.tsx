import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { PasswordScreen } from '../screens/PasswordScreen';
import { SuccessScreen } from '../screens/SuccessScreen';
import { MainTabs } from './MainTabs';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="Password"
        component={PasswordScreen}
        options={{ gestureEnabled: false, animation: 'slide_from_right' } as any}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{ gestureEnabled: false, animation: 'fade' } as any}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
