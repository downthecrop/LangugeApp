import React, { useState, useEffect } from 'react';
import { View, StatusBar, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, BackHandler  } from 'react-native';
import Animated, { Layout, FadeOut, FadeIn } from 'react-native-reanimated';

const commonSpringLayout = Layout.springify().mass(0.8).stiffness(200).damping(15);

const arraysMatch = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index]);
};

const OptionItem = ({ item, onSelect, status }) => {
    let backgroundColor;
    if (status === 'correct') {
        backgroundColor = '#34A853'; // Green for correct
    } else if (status === 'incorrect') {
        backgroundColor = '#a83434'; // Red for incorrect
    } else {
        backgroundColor = '#2c3848'; // Default color
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
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{quizData[currentQuestionIndex].question}</Text>
            </View>
            <Text style={styles.title}>Your Answers</Text>
            <Animated.View style={[styles.optionsContainer, { borderBottomColor: 'white', borderBottomWidth: 1 }]} layout={commonSpringLayout}>
                {answers.map(answer => (
                    <OptionItem key={answer} item={answer} onSelect={handleOptionSelection} status={optionStatuses[answer]} />
                ))}
            </Animated.View>
            <Text style={styles.title}>Options</Text>
            <Animated.View style={styles.optionsContainer} layout={commonSpringLayout}>
                {options.map(option => (
                    <OptionItem key={option} item={option} onSelect={handleOptionSelection} />
                ))}
            </Animated.View>
            <View style={styles.counterContainer}>
                <Text style={styles.counterText}>Correct Answers: {correctAnswersCount}</Text>
            </View>
            <TouchableOpacity style={styles.checkButtonLarge} onPress={checkAnswers}>
                <Text style={styles.checkButtonText}>Check Answers</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#041121',
        justifyContent: 'space-between', // Adjust to space content
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
        padding: 10,
        borderRadius: 4,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        color: '#f9feff',
        fontSize: 18,
    },
    counterContainer: {
        marginTop: 20,
        alignItems: 'center',
        padding: 10,
    },
    counterText: {
        color: '#fdfffc',
        fontSize: 24,
        fontWeight: 'bold',
    },
    checkButtonLarge: { // Adjusted style for the larger check button
        backgroundColor: '#34A853', // Example color, adjust as needed
        paddingVertical: 15, // Increased padding for a taller button
        paddingHorizontal: 20, // Increased padding for a wider button
        borderRadius: 10, // Rounded corners
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 30, // Space from bottom
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
