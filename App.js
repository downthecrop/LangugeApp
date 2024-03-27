import React from 'react';
import { DarkTheme, View, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation, Text, PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './HomeScreen';
import QuizScreen from './QuizScreen';
import SummaryScreen from './SummaryScreen';
import DummyPage2 from './DummyPage'; // Assuming the correct import path is './DummyPage'
import { useTheme } from 'react-native-paper';
import { commonStyles } from './CommonStyles';
import QuizConfigScreen from './QuizConfigScreen';

const Stack = createNativeStackNavigator();

const HomeRoute = () => <HomeScreen />;
const QuizRoute = () => <QuizConfigScreen />;
const SummaryRoute = () => <DummyPage2 />; // You might want to use a different page for Summary

const MainTabs = () => {
  const [index, setIndex] = React.useState(0);
  const { colors } = useTheme();

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
    const iconName = focused ? routeInfo.icon : `${routeInfo.icon}-outline`;
    return <MaterialCommunityIcons name={iconName} size={24} color={focused ? routeInfo.color : 'gray'} />;
  };

  return (
    <BottomNavigation
      //sceneAnimationEnabled={true}
      //sceneAnimationType="opacity"
      barStyle={{ backgroundColor: '#2c2831' }}
      activeColor="white" // Active item text and icon color
      inactiveColor="rgba(255, 255, 255, 0.01)" // Inactive item text and icon color
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
