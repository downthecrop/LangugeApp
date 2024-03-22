import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { commonStyles } from './CommonStyles';
import HomeScreen from './HomeScreen';
import QuizScreen from './QuizScreen';
import SummaryScreen from './SummaryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: commonStyles.darkThemeBackground,
          headerTintColor: commonStyles.lightText.color,
          headerTitleStyle: commonStyles.titleText,
          animation: 'slide_from_right', // Default for iOS, applies it for Android as well
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
