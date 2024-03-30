import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-native-paper';
import { commonStyles } from './CommonStyles';
import QuizScreen from './QuizScreen';
import SummaryScreen from './SummaryScreen';
import BottomNav from './components/BottomNav';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Provider>
        <Stack.Navigator
          screenOptions={{
            headerStyle: commonStyles.darkThemeBackground,
            headerTintColor: commonStyles.lightText.color,
            headerTitleStyle: commonStyles.titleText,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Main" component={BottomNav} options={{ headerShown: false }} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Summary" component={SummaryScreen} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default AppNavigator;
