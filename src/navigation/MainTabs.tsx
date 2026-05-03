import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { ConnectScreen } from '../screens/ConnectScreen';
import { WorkspaceScreen } from '../screens/WorkspaceScreen';
import { DataScreen } from '../screens/DataScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../theme';

const Tab = createBottomTabNavigator();
const { width: WINDOW_WIDTH } = Dimensions.get('window');

type TabItem = {
  name: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const TABS: TabItem[] = [
  { name: 'Home',      icon: 'home' },
  { name: 'Connect',   icon: 'access-point' },
  { name: 'Workspace', icon: 'view-grid' },
  { name: 'Data',      icon: 'database' },
];

const SCREENS: Record<string, React.ComponentType<any>> = {
  Home: HomeScreen,
  Connect: ConnectScreen,
  Workspace: WorkspaceScreen,
  Data: DataScreen,
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const slideAnim = useRef(new Animated.Value(state.index)).current;
  const TAB_BAR_PADDING = 12;
  const TAB_WIDTH = (WINDOW_WIDTH - (TAB_BAR_PADDING * 2)) / TABS.length;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: state.index,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }, [state.index]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [0, TAB_WIDTH, TAB_WIDTH * 2, TAB_WIDTH * 3]
  });

  return (
    <View style={styles.tabBarContainer}>
      <Animated.View 
        style={[
          styles.slidingPill, 
          { 
            width: TAB_WIDTH,
            transform: [{ translateX }] 
          }
        ]} 
      >
        <View style={styles.pillInner} />
      </Animated.View>
      
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tab = TABS.find(t => t.name === route.name)!;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
          >
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name={tab.icon}
                size={22}
                color={isFocused ? '#FFFFFF' : Theme.colors.textSecondary}
              />
            </View>
            <Text style={[styles.label, isFocused && styles.labelActive]}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TABS.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={SCREENS[tab.name]} />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBEBEB',
    height: Platform.OS === 'ios' ? 80 : 65,
    paddingHorizontal: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  slidingPill: {
    position: 'absolute',
    top: 6,
    left: 12,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  pillInner: {
    width: 48,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 6,
    zIndex: 1,
  },
  iconWrap: {
    width: 48,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: Theme.typography.fontFamily.regular,
    color: Theme.colors.textSecondary,
  },
  labelActive: {
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.primary,
  },
});
