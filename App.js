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
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
