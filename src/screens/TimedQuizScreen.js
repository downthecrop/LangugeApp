import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SegmentedButtons, Divider, Portal, Modal, Checkbox, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import quizData from '../data/QuizData';
import useStore from '../store/store';

const TimedQuizScreen = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState({});
    const [value, setValue] = useState('train');
    const quizScores = useStore(state => state.quizScores);


    const aggregateQuestions = () => {
        let questions = [];
        Object.keys(selectedUnits).forEach(index => {
            if (selectedUnits[index]) {
                questions = questions.concat(quizData[index].questions);
            }
        });
       return {
            title: "custom",
            questions: questions
        }
    };

    const handleUnitToggle = (index) => {
        setSelectedUnits(prevUnits => ({
            ...prevUnits,
            [index]: !prevUnits[index]
        }));
    };
    const handleStartButton = () => {
        const selectedIndexes = Object.keys(selectedUnits).filter(index => selectedUnits[index]);
        console.log(selectedIndexes);
        console.log(quizScores)
        if (selectedIndexes.length < 1) {
            console.log("No units selected..");
            return;
        }
    
        navigation.navigate('Quiz', { quizData: aggregateQuestions(), duration: 10 });
    };

    const bestCustom = quizScores["custom"] ? quizScores["custom"] : "0";
    


    return (
        <View style={[styles.container]}>
            <View style={styles.iconTextContainer}>
                <View style={styles.circle}>
                    <Icon
                        source="translate"
                        color={'#e8def8'}
                        size={120}
                    />
                </View>
                <View style={styles.highscore}>
                    <Text style={styles.textSub}>Personal Best: {bestCustom.split("/")[0]}</Text>
                </View>
            </View>
            <View style={[styles.content]}>
                <View style={[{ marginBottom: 40 }]}>
                    <TouchableOpacity style={styles.selectQuizButton} onPress={() => setModalVisible(true)}>
                        <Icon source="plus-circle-outline" color={'#e8def8'} size={24} style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>  Select Quiz Units</Text>
                    </TouchableOpacity>
                    <Portal>
                        <Modal
                            visible={modalVisible}
                            onDismiss={() => setModalVisible(false)}
                            contentContainerStyle={styles.modalContainer}
                        >
                            <ScrollView>
                                {quizData.map((quiz, index) => (
                                    <View key={index} style={styles.modalItem}>
                                        <Text style={styles.text}>{quiz.title}</Text>
                                        <Checkbox
                                            status={selectedUnits[index] ? 'checked' : 'unchecked'}
                                            onPress={() => handleUnitToggle(index)}
                                        />
                                    </View>
                                ))}
                            </ScrollView>

                            <Button mode='outlined' onPress={() => setModalVisible(false)}>Done</Button>
                        </Modal>
                    </Portal>
                </View>
                <Divider />
                <View style={styles.audioToggle}>
                    <View style={styles.segmentedControl}>
                        <SegmentedButtons
                            value={value}
                            onValueChange={setValue}
                            buttons={[
                                {
                                    value: 'walk',
                                    label: 'Audio',
                                    icon: 'volume-high',
                                },
                                {
                                    value: 'train',
                                    label: 'Mix',
                                    icon: 'bowl-mix'
                                },
                                {
                                    value: 'drive',
                                    label: 'Text',
                                    icon: 'text-short',
                                },
                            ]}
                        />
                    </View>
                </View>

                <Button mode="contained" onPress={handleStartButton}>Start 5 Minute Quiz</Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1b1f',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    highscore: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c2831',
        borderRadius: 32,
        padding: 10,
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        fontSize: 16,
    },
    textSub: {
        color: 'white',
        fontSize: 16,
    },
    audioToggle: {
        marginVertical: 20,
    },
    circle: {
        backgroundColor: '#101010',
        width: 180,
        height: 180,
        borderRadius: 150,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    iconTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    segmentedControl: {
        justifyContent: 'center',
        marginTop: 10,
    },
    selectQuizButton: {
        backgroundColor: '#101010',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e8def8',
        backgroundColor: 'transparent',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#e8def8',
        fontSize: 16,
    },
    modalContainer: {
        borderRadius: 24,
        backgroundColor: '#1c1b1f',
        padding: 20,
        margin: 50,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    iconTextContainer: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default TimedQuizScreen;
