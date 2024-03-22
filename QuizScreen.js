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
    const [options, setOptions] = useState(quizData[currentQuestionIndex].options);
    const [answers, setAnswers] = useState([]);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

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
    
        if (currentQuestionIndex < quizData.length - 1) {
            if (isCorrect) {
                setCorrectAnswersCount(prevCount => prevCount + 1);
            }
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setOptions(quizData[nextIndex].options);
            setAnswers([]);
        } else {
            setCorrectAnswersCount(prevCount => {
                const newCount = isCorrect ? prevCount + 1 : prevCount;
                Alert.alert("Quiz Completed", `You've completed all questions!\nCorrect Answers: ${newCount}/${quizData.length}`, [
                    { text: "See Summary", onPress: () => navigation.replace('Summary', { score: newCount, totalQuestions: quizData.length }) }
                ]);
                return newCount;
            });
        }
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
            <View style={styles.counterContainer}>
                <Text style={styles.counterText}>Correct Answers: {correctAnswersCount}</Text>
            </View>
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
