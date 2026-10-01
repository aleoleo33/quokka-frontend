import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(state.index)).current;
  const TAB_BAR_MARGIN = 16;
  const CONTAINER_PADDING = 8;
  const TAB_WIDTH = (WINDOW_WIDTH - (TAB_BAR_MARGIN * 2) - (CONTAINER_PADDING * 2)) / TABS.length;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: state.index,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [state.index]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [0, TAB_WIDTH, TAB_WIDTH * 2, TAB_WIDTH * 3]
  });

  return (
    <View 
      style={[
        styles.tabBarContainer, 
        { bottom: insets.bottom > 0 ? insets.bottom : 16 }
      ]}
    >
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
            activeOpacity={0.8}
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
            {!isFocused && <Text style={styles.label}>{tab.name}</Text>}
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    height: 58,
    marginHorizontal: 16,
    borderRadius: 29,
    paddingHorizontal: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slidingPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  pillInner: {
    width: 52,
    height: 42,
    borderRadius: 21,
    backgroundColor: Theme.colors.primary,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    zIndex: 1,
  },
  iconWrap: {
    width: 48,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.textSecondary,
    marginTop: 1,
  },
  labelActive: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    color: Theme.colors.primary,
  },
});
