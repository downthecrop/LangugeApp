import React from 'react';
import { NavigationContainer, StatusBar } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { commonStyles } from './CommonStyles';
import HomeScreen from './HomeScreen';
import QuizScreen from './QuizScreen';
import SummaryScreen from './SummaryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <>
    <NavigationContainer>
      {/* Adjust StatusBar here as needed */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: commonStyles.darkThemeBackground,
          headerTintColor: commonStyles.lightText.color,
          headerTitleStyle: commonStyles.titleText,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
};

export default AppNavigator;
