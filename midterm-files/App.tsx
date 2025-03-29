import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SavedJobsProvider, useSavedJobs } from './src/context/SavedJobsContext';
import JobFinderScreen from './src/screens/JobFinderScreen';
import SavedJobsScreen from './src/screens/SavedJobsScreen';
import { RootStackParamList } from './src/types/navigation';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <ThemeProvider>
      <SavedJobsProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen 
              name="MainTabs" 
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SavedJobsProvider>
    </ThemeProvider>
  );
};

export default App;
