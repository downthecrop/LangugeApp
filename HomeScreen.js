import React from 'react';
import { ScrollView, StyleSheet } from 'react-native'; // Import ScrollView
import { commonStyles } from './CommonStyles'; // Import common styles
import QuizButton from './QuizButton';

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

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={[styles.container, commonStyles.darkThemeBackground]}>
      <QuizButton quizData={quizData} imgUrl={require("./assets/bg.webp")} title="Start Sino Numbers Quiz" subTitle="Tap to begin!" navigation={navigation}></QuizButton>
      <QuizButton quizData={quizData} imgUrl={require("./assets/bg.webp")} title="Start Sino Numbers Quiz" subTitle="Tap to begin!" navigation={navigation}></QuizButton>
      <QuizButton quizData={quizData} imgUrl={require("./assets/bg.webp")} title="Start Sino Numbers Quiz" subTitle="Tap to begin!" navigation={navigation}></QuizButton>
      <QuizButton quizData={quizData} imgUrl={require("./assets/bg.webp")} title="Start Sino Numbers Quiz" subTitle="Tap to begin!" navigation={navigation}></QuizButton>
      <QuizButton quizData={quizData} imgUrl={require("./assets/bg.webp")} title="Start Sino Numbers Quiz" subTitle="Tap to begin!" navigation={navigation}></QuizButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Add some padding at the bottom for better scrolling experience
  },
});

export default HomeScreen;
