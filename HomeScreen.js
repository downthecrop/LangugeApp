import React from 'react';
import { ScrollView, StyleSheet, StatusBar } from 'react-native'; // Import ScrollView
import { commonStyles } from './CommonStyles'; // Import common styles
import QuizButton from './QuizButton';
import { useNavigation } from '@react-navigation/native';

const quizData = [
  {
    question: "What is the first question?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    correctAnswers: ["Option 3", "Option 2"],
  },
  {
    question: "What is the second question?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswers: ["Option A", "Option C"],
  },
  // Add more questions as needed
];

const HomeScreen = () => {
  const navigation = useNavigation(); // Get the navigation object
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1c1b1f" />
      <ScrollView style={[commonStyles.darkThemeBackground, styles.scrollView]} contentContainerStyle={styles.container}>
        <QuizButton quizData={quizData} imgUrl={require("./assets/1.png")} title="Sino Korean Numbers" subTitle="Tap to begin!" navigation={navigation} rating={0}></QuizButton>
        <QuizButton quizData={quizData} imgUrl={require("./assets/3.png")} title="Native Korean Number" subTitle="Tap to begin!" navigation={navigation} rating={0}></QuizButton>
        <QuizButton quizData={quizData} imgUrl={require("./assets/2.png")} title="Days of the Week" subTitle="Tap to begin!" navigation={navigation} rating={0}></QuizButton>
        <QuizButton quizData={quizData} imgUrl={require("./assets/5.png")} title="Months of the Year" subTitle="Tap to begin!" navigation={navigation} rating={0}></QuizButton>
        <QuizButton quizData={quizData} imgUrl={require("./assets/5.png")} title="Ages" subTitle="Tap to begin!" navigation={navigation} rating={0}></QuizButton>
        <QuizButton quizData={quizData} imgUrl={require("./assets/4.png")} title="Money Values #1" subTitle="Tap to begin!" navigation={navigation} rating={0}></QuizButton>
        <QuizButton quizData={quizData} imgUrl={require("./assets/4.png")} title="Money Values #2" subTitle="Tap to begin!" navigation={navigation} rating={0}></QuizButton>
        <QuizButton quizData={quizData} imgUrl={require("./assets/4.png")} title="Money Values #3" subTitle="Tap to begin!" navigation={navigation} rating={0}></QuizButton>
        <QuizButton quizData={quizData} imgUrl={require("./assets/6.png")} title="Korean Counters" subTitle="Essential Words to Use with Numbers" navigation={navigation} rating={0}></QuizButton>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1, // Make ScrollView expand to fill the space
  },
  container: {
    flexGrow: 1, // Ensure the container fills the height
    alignItems: 'center', // Center items horizontally
    paddingTop: 20, // Padding at the top
    paddingBottom: 20, // Padding at the bottom
  },
});

export default HomeScreen;
