import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { commonStyles } from './CommonStyles'; // Import common styles

const commonSpringLayout = Layout.springify().mass(0.8).stiffness(200).damping(15);

const arraysMatch = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index]);
};

const OptionItem = ({ item, onSelect, status }) => {
    let backgroundColor;
    if (status === 'correct') {
        backgroundColor = '#7db14f'; // Green for correct
    } else if (status === 'incorrect') {
        backgroundColor = '#cd4b4b'; // Red for incorrect
    } else {
        backgroundColor = '#4a4458'; // Default color
    }

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            layout={commonSpringLayout}
            style={[styles.optionItem, { backgroundColor }]}
        >
            <TouchableOpacity onPress={() => onSelect(item)}>
                <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};


const QuizScreen = ({ route, navigation }) => {
    const { quizData } = route.params;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState(quizData[currentQuestionIndex].options);
    const [optionStatuses, setOptionStatuses] = useState({});
    const [answers, setAnswers] = useState([]);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    const progress = (currentQuestionIndex + 1) / quizData.length;

    const handleBackButtonPress = () => {
        Alert.alert(
            "Exit Quiz", // Alert Title
            "Are you sure you want to exit the quiz?", // Alert Message
            [
                { text: "Cancel", onPress: () => { }, style: "cancel" },
                { text: "Yes", onPress: () => navigation.goBack() },
            ],
            { cancelable: true }
        );

        return true;
    };

    // Initialize a shared value for the progress bar width
    const progressBarWidth = useSharedValue(0);

    useEffect(() => {
        // Calculate the new width of the progress bar as a percentage
        progressBarWidth.value = withTiming((currentQuestionIndex + 1) / quizData.length * 100, {
            duration: 300, // Animation duration in milliseconds
        });
    }, [currentQuestionIndex, quizData.length]);

    // Animated style for the progress bar
    const animatedProgressBarStyle = useAnimatedStyle(() => {
        return {
            width: `${progressBarWidth.value}%`,
        };
    });

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
    }, [navigation]);


    const handleOptionSelection = (selectedOption) => {
        if (answers.includes(selectedOption)) {
            setAnswers(answers.filter(answer => answer !== selectedOption));
            setOptions([...options, selectedOption]);
        } else {
            setOptions(options.filter(option => option !== selectedOption));
            setAnswers([...answers, selectedOption]);
        }
    };
    const checkAnswers = () => {
        const isCorrect = arraysMatch(answers, quizData[currentQuestionIndex].correctAnswers);

        // Update optionStatuses to reflect feedback
        let statuses = {};
        answers.forEach(option => {
            statuses[option] = isCorrect ? 'correct' : 'incorrect';
        });
        setOptionStatuses(statuses);

        // Use setTimeout to introduce a delay
        setTimeout(() => {
            if (currentQuestionIndex < quizData.length - 1) {
                if (isCorrect) {
                    setCorrectAnswersCount(prevCount => prevCount + 1);
                }
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                setOptions(quizData[nextIndex].options);
                setAnswers([]);
                setOptionStatuses({}); // Reset option statuses for the next question
            } else {
                setCorrectAnswersCount(prevCount => {
                    const newCount = isCorrect ? prevCount + 1 : prevCount;
                    Alert.alert("Quiz Completed", `You've completed all questions!\nCorrect Answers: ${newCount}/${quizData.length}`, [
                        { text: "See Summary", onPress: () => navigation.replace('Summary', { score: newCount, totalQuestions: quizData.length }) }
                    ]);
                    return newCount;
                });
            }
        }, 500);
    };


    return (
        <View style={[commonStyles.darkThemeBackground, styles.wrapper]}>
            <ScrollView contentContainerStyle={[commonStyles.darkThemeBackground, styles.container]}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionText}>{quizData[currentQuestionIndex].question}</Text>
                </View>
                <Animated.View style={[styles.optionsContainer, { borderBottomColor: '#3c4045', borderBottomWidth: 1 }]} layout={commonSpringLayout}>
                    {answers.map(answer => (
                        <OptionItem key={answer} item={answer} onSelect={handleOptionSelection} status={optionStatuses[answer]} />
                    ))}
                </Animated.View>
                <Animated.View style={styles.optionsContainer} layout={commonSpringLayout}>
                    {options.map(option => (
                        <OptionItem key={option} item={option} onSelect={handleOptionSelection} />
                    ))}
                </Animated.View>
                <TouchableOpacity style={styles.checkButtonLarge} onPress={checkAnswers}>
                    <Text style={styles.checkButtonText}>Check Answers</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, animatedProgressBarStyle]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        justifyContent: 'space-between', // Adjust to space content
    },
    wrapper: {
        flexGrow: 1,
    },
    questionContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    questionText: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
    },
    title: {
        color: '#fdfffc',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        minHeight: 50,
    },
    optionItem: {
        padding: 14,
        borderRadius: 24,
        margin: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        color: '#f9feff',
        fontSize: 18,
    },
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
    counterText: {
        color: '#fdfffc',
        fontSize: 24,
        fontWeight: 'bold',
    },
    checkButtonLarge: { // Adjusted style for the larger check button
        backgroundColor: '#4f378b', // Example color, adjust as needed
        paddingVertical: 15, // Increased padding for a taller button
        paddingHorizontal: 20, // Increased padding for a wider button
        borderRadius: 24, // Rounded corners
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        alignSelf: 'stretch', // Stretch to the container's width
    },
    checkButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Add any other styles you might need
});


export default QuizScreen;
