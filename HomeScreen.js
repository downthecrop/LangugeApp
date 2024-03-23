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
    <ScrollView style={[commonStyles.darkThemeBackground, styles.scrollView]} contentContainerStyle={styles.container}>
      <QuizButton quizData={quizData} imgUrl={require("./assets/bg.webp")} title="Start Sino Numbers Quiz" subTitle="Tap to begin!" navigation={navigation} rating={5}></QuizButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1, // Make ScrollView expand to fill the space
    // Set the background color to match the QuizButton or your theme
    backgroundColor: '#041121', // Replace with the color that matches your design
  },
  container: {
    flexGrow: 1, // Ensure the container fills the height
    alignItems: 'center', // Center items horizontally
    paddingTop: 20, // Padding at the top
    paddingBottom: 20, // Padding at the bottom
  },
});

export default HomeScreen;
