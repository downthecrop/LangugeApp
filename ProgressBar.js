import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ currentQuestionIndex, quizData }) => {
    
    const progressBarWidth = useSharedValue(0);

    useEffect(() => {
        progressBarWidth.value = withTiming((currentQuestionIndex + 1) / quizData.length * 100, {
            duration: 300,
        });
    }, [currentQuestionIndex, quizData.length]);

    const animatedProgressBarStyle = useAnimatedStyle(() => {
        return {
            width: `${progressBarWidth.value}%`,
        };
    });


    return (
        <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, animatedProgressBarStyle]} />
        </View>
    )
}
const styles = StyleSheet.create({
    progressBarContainer: {
        height: 4,
        marginTop: 20,
        width: '100%',
        backgroundColor: '#49454f',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#d0bcff',
    },
});

export default ProgressBar;