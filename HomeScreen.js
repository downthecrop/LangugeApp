// HomeScreen.js
import React from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { commonStyles } from './CommonStyles'; // Import common styles
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Quiz', { quizData })}>
        <ImageBackground
          source={require('./assets/bg.webp')} // Add your image URL
          style={styles.backgroundImage}
          resizeMode="cover">
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'transparent']}
            style={styles.backgroundImage}
          >
            <FontAwesome name="question-circle" size={24} color="white" />
            <Text style={styles.headerText}>Start Sino Numbers Quiz</Text>
            <Text style={styles.subText}>Tap to begin!</Text>
          </LinearGradient>
        </ImageBackground>
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
  button: {
    width: 300, // Set your desired width
    height: 150, // Set your desired height
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Add some margin if you have multiple buttons
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24, // Adjust the size as needed
    fontWeight: 'bold',
    marginBottom: 5, // Space between header and subtext
  },
  subText: {
    color: 'white',
    fontSize: 16, // Adjust the size as needed
  },
});

export default HomeScreen;
