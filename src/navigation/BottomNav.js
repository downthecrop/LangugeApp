import React from 'react';
import { BottomNavigation, Text, PaperProvider, Provider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import TimedQuizScreen from '../screens/TimedQuizScreen';
import HomeScreen from '../screens/HomeScreen';
import UserPage from '../screens/UserScreen';

const HomeRoute = () => <HomeScreen />;
const QuizConfigRoute = () => <TimedQuizScreen />;
const SummaryRoute = () => <UserPage />;

const BottomNav = () => {
  const [index, setIndex] = React.useState(0);
  const { colors } = useTheme();

  const [routes] = React.useState([
    { key: 'home', title: 'Home', icon: 'home', color: colors.primary },
    { key: 'quiz', title: 'Quiz', icon: 'clipboard-text', color: colors.primary },
    { key: 'summary', title: 'Summary', icon: 'account', color: colors.primary },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    quiz: QuizConfigRoute,
    summary: SummaryRoute,
  });

  const renderIcon = ({ route, focused }) => {
    const routeInfo = routes.find((r) => r.key === route.key);
    const iconName = focused ? routeInfo.icon : `${routeInfo.icon}-outline`;
    return <MaterialCommunityIcons name={iconName} size={24} color={focused ? routeInfo.color : 'gray'} />;
  };

  return (
    <BottomNavigation
      barStyle={{ backgroundColor: '#2c2831' }}
      activeColor="white"
      inactiveColor="rgba(255, 255, 255, 0.01)"
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={renderIcon}
    />
  );
};

export default BottomNav;