import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './HomeScreen';
import QuizScreen from './QuizScreen';
import SummaryScreen from './SummaryScreen';
import DummyPage2 from './DummyPage'; // Assuming the correct import path is './DummyPage'
import { useTheme } from 'react-native-paper';
import { commonStyles } from './CommonStyles';

const Stack = createNativeStackNavigator();

const HomeRoute = () => <HomeScreen />;
const QuizRoute = () => <DummyPage2 />;
const SummaryRoute = () => <DummyPage2 />; // You might want to use a different page for Summary

const MainTabs = () => {
  const [index, setIndex] = React.useState(0);
  const { colors } = useTheme(); // Use the theme colors from React Native Paper

  const [routes] = React.useState([
    { key: 'home', title: 'Home', icon: 'home', color: colors.primary },
    { key: 'quiz', title: 'Quiz', icon: 'clipboard-text', color: colors.primary },
    { key: 'summary', title: 'Summary', icon: 'account', color: colors.primary },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    quiz: QuizRoute,
    summary: SummaryRoute,
  });

  const renderIcon = ({ route, focused }) => {
    const routeInfo = routes.find((r) => r.key === route.key);
    const iconName = focused ? routeInfo.icon : `${routeInfo.icon}-outline`; // Assuming your icons follow this naming convention
    return <MaterialCommunityIcons name={iconName} size={24} color={focused ? routeInfo.color : 'gray'} />;
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={renderIcon}
    />
  );
};


const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: commonStyles.darkThemeBackground,
          headerTintColor: commonStyles.lightText.color,
          headerTitleStyle: commonStyles.titleText,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
