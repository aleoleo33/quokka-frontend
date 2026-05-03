import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
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
        name="MainTabs"
        component={MainTabs}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
