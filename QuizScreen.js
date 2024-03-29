import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, BackHandler } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { commonStyles } from './CommonStyles';
import { Button, Text, Dialog, Portal, Icon } from 'react-native-paper';
import OptionItem from './OptionItem';
import ProgressBar from './ProgressBar';
import Sound from 'react-native-sound'; // Assuming you're using react-native-sound

const commonSpringLayout = Layout.springify().mass(0.8).stiffness(200).damping(15);

const arraysMatch = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index]);
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
        setExitDialogVisible(true);
        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
        };
    }, []);


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

        let statuses = {};
        answers.forEach(option => {
            statuses[option] = isCorrect ? 'correct' : 'incorrect';
        });
        setOptionStatuses(statuses);

        setTimeout(() => {
            if (currentQuestionIndex < quizData.length - 1) {
                if (isCorrect) {
                    setCorrectAnswersCount(prevCount => prevCount + 1);
                }
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                setOptions(quizData[nextIndex].options);
                setAnswers([]);
                setOptionStatuses({});
            } else {
                setCorrectAnswersCount(prevCount => {
                    const newCount = isCorrect ? prevCount + 1 : prevCount;
                    setCompletionDialogVisible(true);
                    return newCount;
                });
            }
        }, 500);
    };

    const playAudio = (audio) => {
        console.log("Attempting to play: " + audio);
        var audio = new Sound(
            audio,
            error => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                }
                // if loaded successfully
                console.log(
                    'duration in seconds: ' +
                    audio.getDuration() +
                    'number of channels: ' +
                    audio.getNumberOfChannels(),
                );
                audio.play()
            },
        );
    };

    return (
        <View style={[commonStyles.darkThemeBackground, styles.wrapper]}>
            <ScrollView contentContainerStyle={[commonStyles.darkThemeBackground, styles.container]}>
                <View style={styles.questionContainer}>
                    {quizData[currentQuestionIndex].audio ? (
                        <TouchableOpacity onPress={() => playAudio(quizData[currentQuestionIndex].audio)}>
                            <Icon
                                source="volume-high"
                                color={'#e8def8'}
                                size={120}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.questionText}>{quizData[currentQuestionIndex].question}</Text>
                    )}
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
            <ProgressBar currentQuestionIndex={currentQuestionIndex} quizData={quizData} />
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

    counterText: {
        color: '#fdfffc',
        fontSize: 24,
        fontWeight: 'bold',
    },
    checkButtonLarge: { // Adjusted style for the larger check button
        backgroundColor: '#6750a4', // Example color, adjust as needed
        paddingVertical: 15, // Increased padding for a taller button
        paddingHorizontal: 20, // Increased padding for a wider button
        borderRadius: 24, // Rounded corners
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        alignSelf: 'stretch', // Stretch to the container's width
    },
    checkButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Add any other styles you might need
});


export default QuizScreen;
