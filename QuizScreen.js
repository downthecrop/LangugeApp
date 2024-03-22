import React, { useState } from 'react';
import { View, StatusBar, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Animated, { Layout, FadeOut, FadeIn } from 'react-native-reanimated';

const commonSpringLayout = Layout.springify().mass(0.8).stiffness(200).damping(15);

const arraysMatch = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index]);
};

const OptionItem = ({ item, onSelect }) => {
    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            layout={commonSpringLayout}
            style={styles.optionItem}
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
    const currentQuestion = quizData[currentQuestionIndex];


    // Initialize options and answers based on the current question
    const [options, setOptions] = useState(currentQuestion.options);
    const [answers, setAnswers] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);

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
        if (currentQuestionIndex < quizData.length - 1) {
            setUserAnswers(prevUserAnswers => {
                const newUserAnswers = [...prevUserAnswers, answers];
                // Move to the next question since the quiz is not yet completed
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                setOptions(quizData[nextIndex].options);
                setAnswers([]);
                return newUserAnswers;
            });
        } else {
            // Done inside of setUserAnswers because of an Async issue
            setUserAnswers(prevUserAnswers => {
                const newUserAnswers = [...prevUserAnswers, answers];

                // Calculate the score with the newly updated userAnswers
                const score = calculateScore(newUserAnswers); // Pass newUserAnswers to use the most up-to-date answers
                const totalQuestions = quizData.length;

                // Navigate to Summary screen with the score
                Alert.alert("Quiz Completed", "You've completed all questions!", [
                    { text: "See Summary", onPress: () => navigation.replace('Summary', { score, totalQuestions }) }
                ]);
                return newUserAnswers;
            });
        }
    };

    const calculateScore = (userAnswers) => {
        let score = 0;
        quizData.forEach((question, index) => {
            if (userAnswers[index] && arraysMatch(question.correctAnswers, userAnswers[index])) {
                score += 1;
            }
        });

        return score;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </View>
            <Text style={styles.title}>Your Answers</Text>
            <Animated.View style={[styles.optionsContainer, { borderBottomColor: 'white', borderBottomWidth: 1 }]} layout={commonSpringLayout}>
                {answers.map(answer => (
                    <OptionItem key={answer} item={answer} onSelect={handleOptionSelection} />
                ))}
            </Animated.View>
            <Text style={styles.title}>Options</Text>
            <Animated.View style={styles.optionsContainer} layout={commonSpringLayout}>
                {options.map(option => (
                    <OptionItem key={option} item={option} onSelect={handleOptionSelection} />
                ))}
            </Animated.View>
            <TouchableOpacity style={styles.checkButton} onPress={checkAnswers}>
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
        backgroundColor: '#2c3848',
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
});

export default QuizScreen;
