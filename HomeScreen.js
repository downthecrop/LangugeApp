// HomeScreen.js
import React from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { commonStyles } from './CommonStyles'; // Import common styles
import { FontAwesome } from '@expo/vector-icons';

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
    <View style={[styles.container, commonStyles.darkThemeBackground]}>
      {/* Example button for navigating to a quiz */}
      <Button
        title="Start Sino Numbers Quiz"
        onPress={() => navigation.navigate('Quiz', { quizData })}
      />
    <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Quiz', { quizData })}>
        <FontAwesome name="question-circle" size={24} color="white" />
        <Text style={styles.buttonText}>Start Sino Numbers Quiz</Text>
      </TouchableOpacity>
      {/* Add more buttons/options as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default HomeScreen;
