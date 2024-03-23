import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const QuizButton = ({ quizData, imgUrl, title, subTitle, navigation, rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <FontAwesome
                key={i}
                name={i <= rating ? "star" : "star-o"}
                size={16}
                color="white"
            />
        );
    }

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Quiz', { quizData })}
        >
            <ImageBackground
                source={imgUrl}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                    style={styles.gradient}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subTitle}>{subTitle}</Text>
                        <View style={styles.starsContainer}>{stars}</View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  button: {
    width: '90%', // Take 90% width of the parent
    height: 100, // Height as shown in your image
    marginBottom: 20, // Spacing between buttons
    borderRadius: 16, // This rounds the corners
    overflow: 'hidden', // This is required to clip the background image within the rounded corners
    alignSelf: 'center', // Centers the button in the parent view
},
backgroundImage: {
    flex: 1, // Use all available space
    borderRadius: 16, // Match the borderRadius of the TouchableOpacity
    justifyContent: 'flex-end', // Align content to bottom
},
    gradient: {
        flex: 1, // Use all available space
        justifyContent: 'center', // Center content vertically
    },
    textContainer: {
        padding: 10, // Padding around the text and stars
    },
    title: {
        color: 'white',
        fontSize: 20, // Adjusted to match the design
        fontWeight: 'bold',
    },
    subTitle: {
        color: 'white',
        fontSize: 14, // Adjusted to match the design
    },
    starsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end', // This aligns the stars to the right
      marginTop: 5,
      position: 'absolute', // Position the stars independently of the text
      right: 10, // Right padding for the stars
      bottom: 10, // Bottom padding for the stars
  },
});

export default QuizButton;
