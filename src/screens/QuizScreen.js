import React, { useState, useEffect, useLayoutEffect } from 'react';
import Sound from 'react-native-sound';
import { View, TouchableOpacity, StyleSheet, ScrollView, BackHandler } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import { Button, Text, Dialog, Portal, Icon } from 'react-native-paper';
import { commonStyles } from '../styles/CommonStyles';
import OptionItem from '../components/OptionItem';
import ProgressBar from '../components/ProgressBar';
import useStore from '../store/store';
import CountdownTimerBar from '../components/CountdownTimerBar';

const correctSFX = require("../../assets/correct.mp3");
const incorrectSFX = require("../../assets/incorrect.mp3");

const arraysMatch = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((element, index) => element === arr2[index]);
};

function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

const commonSpringLayout = Layout.springify().mass(0.8).stiffness(200).damping(15);

const QuizScreen = ({ route, navigation }) => {
    const { quizData: quiz, duration } = route.params;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [optionStatuses, setOptionStatuses] = useState({});
    const [answers, setAnswers] = useState([]);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [exitDialogVisible, setExitDialogVisible] = useState(false);
    const [completionDialogVisible, setCompletionDialogVisible] = useState(false);
    const setScore = useStore((state) => state.setScore);
    const soundEffectsEnabled = useStore((state) => state.sfxEnabled);


    const isTimedQuiz = !!duration;


    useEffect(() => {
        if (isTimedQuiz) {
            const timer = setTimeout(() => {
                timeUp();
            }, duration * 1000);

            return () => clearTimeout(timer);
        }
    }, [duration, isTimedQuiz]);

    const timeUp = () => {
        setCompletionDialogVisible(true);
    };



    useLayoutEffect(() => {
        navigation.setOptions({
            title: quiz.title,
        });
    }, [navigation, quiz.title]);


    useEffect(() => {
        setOptions(shuffleArray(quiz.questions[currentQuestionIndex].options));
    }, [currentQuestionIndex, quiz]);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPress);
        };
    }, []);

    useEffect(() => {
        const currentQuestionAudio = quiz.questions[currentQuestionIndex].audio;
        if (currentQuestionAudio) {
            playAudio(currentQuestionAudio);
        }
    }, [currentQuestionIndex]);


    const handleOptionSelection = (selectedOption) => {
        if (answers.includes(selectedOption)) {
            setAnswers(answers.filter(answer => answer !== selectedOption));
            setOptions([...options, selectedOption]);
        } else {
            setOptions(options.filter(option => option !== selectedOption));
            setAnswers([...answers, selectedOption]);
        }
    };

    const handleBackButtonPress = () => {
        setExitDialogVisible(true);
        return true;
    };

    const playFeedbacks = (isCorrect) => {
        if(!soundEffectsEnabled) return;
        isCorrect ? playAudio(correctSFX) : playAudio(incorrectSFX);
    }

    const checkAnswers = () => {
        const isCorrect = arraysMatch(answers, quiz.questions[currentQuestionIndex].correctAnswers);

        playFeedbacks(isCorrect);

        let statuses = {};
        answers.forEach(option => {
            statuses[option] = isCorrect ? 'correct' : 'incorrect';
        });
        setOptionStatuses(statuses);

        setTimeout(() => {
            if (currentQuestionIndex < quiz.questions.length - 1) {
                if (isCorrect) {
                    setCorrectAnswersCount(prevCount => prevCount + 1);
                }
                const nextIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextIndex);
                setOptions(shuffleArray(quiz.questions[nextIndex].options));
                setAnswers([]);
                setOptionStatuses({});
            } else {
                setCorrectAnswersCount(prevCount => {
                    const newCount = isCorrect ? prevCount + 1 : prevCount;
                    setCompletionDialogVisible(true);
                    setScore(quiz.title, newCount, quiz.questions.length);
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
                audio.play()
            },
        );
    };

    return (
        <View style={[commonStyles.darkThemeBackground, styles.wrapper]}>
            <ScrollView contentContainerStyle={[commonStyles.darkThemeBackground, styles.container]}>
                <View style={styles.questionContainer}>
                    {quiz.questions[currentQuestionIndex].audio ? (
                        <TouchableOpacity onPress={() => playAudio(quiz.questions[currentQuestionIndex].audio)}>
                            <Icon
                                source="volume-high"
                                color={'#e8def8'}
                                size={120}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.questionText}>{quiz.questions[currentQuestionIndex].question}</Text>
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
            {isTimedQuiz ? (
                <CountdownTimerBar duration={duration} />
            ) : (
                <ProgressBar progress={(currentQuestionIndex / quiz.questions.length) * 100} />
            )}
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
                        <Text>You've completed all questions! in {quiz.title} </Text>
                        <Text>Correct Answers: {correctAnswersCount}/{quiz.questions.length}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setCompletionDialogVisible(false);
                            navigation.replace('Summary', { score: correctAnswersCount, totalQuestions: quiz.questions.length });
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
        fontSize: 50,
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
    checkButtonLarge: {
        backgroundColor: '#6750a4',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        alignSelf: 'stretch',
    },
    checkButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});


export default QuizScreen;
