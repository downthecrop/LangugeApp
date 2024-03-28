import React from 'react';
import { ScrollView, StyleSheet, StatusBar } from 'react-native'; // Import ScrollView
import { commonStyles } from './CommonStyles'; // Import common styles
import QuizButton from './QuizButton';
import { useNavigation } from '@react-navigation/native';
import quizData from './QuizData';

const HomeScreen = () => {
  const navigation = useNavigation(); // Get the navigation object
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1c1b1f" />
      <ScrollView style={[commonStyles.darkThemeBackground, styles.scrollView]} contentContainerStyle={styles.container}>
        {quizData.map((quiz, index) => (
          <QuizButton
            key={index} // Consider using a more unique key if available
            quizData={quiz.questions} // Assuming you want to pass the entire quiz object
            imgUrl={quiz.imgUrl}
            title={quiz.title}
            subTitle={quiz.subTitle}
            navigation={navigation}
            rating={quiz.rating}
          />
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1, // Make ScrollView expand to fill the space
    backgroundColor: '#1c1b1f',
  },
  container: {
    flexGrow: 1, // Ensure the container fills the height
    alignItems: 'center', // Center items horizontally
    paddingTop: 20, // Padding at the top
    paddingBottom: 20, // Padding at the bottom
    backgroundColor: '#1c1b1f',
  },
});

export default HomeScreen;
