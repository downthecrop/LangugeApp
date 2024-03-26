import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { commonStyles } from './CommonStyles'; // Import common styles
import { Button, Dialog, Portal, PaperProvider, Provider } from 'react-native-paper';

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
    const [options, setOptions] = useState([]);
    const [optionStatuses, setOptionStatuses] = useState({});
    const [answers, setAnswers] = useState([]);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [exitDialogVisible, setExitDialogVisible] = useState(false);
    const [completionDialogVisible, setCompletionDialogVisible] = useState(false);


    useEffect(() => {
        setOptions(quizData[currentQuestionIndex].options);
    }, [currentQuestionIndex, quizData]);

    const handleBackButtonPress = () => {
        setExitDialogVisible(true); // Show the dialog
        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
        };
    }, []);

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
                    setCompletionDialogVisible(true);
                    return newCount;
                });
            }
        }, 500);
    };


    return (
        <Provider>
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
                <Portal>
                    <Dialog visible={exitDialogVisible} onDismiss={() => setExitDialogVisible(false)}>
                        <Dialog.Title>Exit Quiz</Dialog.Title>
                        <Dialog.Content>
                            <Text>Are you sure you want to exit the quiz?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setExitDialogVisible(false)}>Cancel</Button>
                            <Button onPress={() => {
                                setExitDialogVisible(false);
                                navigation.goBack();
                            }}>Yes</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={completionDialogVisible} onDismiss={() => setCompletionDialogVisible(false)}>
                        <Dialog.Title>Quiz Completed</Dialog.Title>
                        <Dialog.Content>
                            <Text>You've completed all questions!</Text>
                            <Text>Correct Answers: {correctAnswersCount}/{quizData.length}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => {
                                setCompletionDialogVisible(false);
                                navigation.replace('Summary', { score: correctAnswersCount, totalQuestions: quizData.length });
                            }}>See Summary</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </Provider>
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
        backgroundColor: '#d0bcff', // Example color, adjust as needed
        paddingVertical: 15, // Increased padding for a taller button
        paddingHorizontal: 20, // Increased padding for a wider button
        borderRadius: 24, // Rounded corners
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        alignSelf: 'stretch', // Stretch to the container's width
    },
    checkButtonText: {
        color: '#381e72',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Add any other styles you might need
});


export default QuizScreen;
