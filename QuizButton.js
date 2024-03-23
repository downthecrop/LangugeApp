import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const QuizButton = ({ quizData, imgUrl, title, subTitle, navigation }) => {
    return (
        <TouchableOpacity
            style={styles.button} // Make sure this style exists or remove it
            onPress={() => navigation.navigate('Quiz', { quizData })}>
            <ImageBackground
                source={imgUrl}
                style={styles.backgroundImage}
                resizeMode="cover">
                <LinearGradient
                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                    style={styles.backgroundImage}>
                    <FontAwesome name="question-circle" size={24} color="white" />
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subTitle}>{subTitle}</Text>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
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
    title: {
      color: 'white',
      fontSize: 24, // Adjust the size as needed
      fontWeight: 'bold',
      marginBottom: 5, // Space between header and subtext
    },
    subTitle: {
      color: 'white',
      fontSize: 16, // Adjust the size as needed
    },
  });

export default QuizButton;
