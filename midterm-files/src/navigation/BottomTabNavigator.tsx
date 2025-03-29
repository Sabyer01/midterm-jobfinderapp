import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JobFinderScreen from '../screens/JobFinderScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import { RootTabParamList } from '../types/navigation';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const BottomTabNavigator = () => {
  const { savedJobs } = useSavedJobs();
  const { isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#a47e2d',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Job Finder"
        component={JobFinderScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
          tabBarActiveTintColor: '#a47e2d',
        }}
      />
      <Tab.Screen
        name="Saved Jobs"
        component={SavedJobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="bookmark" size={size} color={color} />
              {savedJobs.length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>
                    {savedJobs.length}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarActiveTintColor: '#04603f',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: '#a47e2d',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  notificationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
}); 