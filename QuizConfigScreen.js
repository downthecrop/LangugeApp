import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { commonStyles } from './CommonStyles';
import { SegmentedButtons, Divider, Portal, Modal, Checkbox, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import quizData from './QuizData';

const QuizConfigScreen = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState({});

    const questions = quizData[0].questions;
    const [value, setValue] = React.useState('train');

    const handleUnitToggle = (unit) => {
        setSelectedUnits(prevUnits => ({
            ...prevUnits,
            [unit]: !prevUnits[unit]
        }));
    };

    return (
        <View style={[styles.container, commonStyles.darkThemeBackground]}>
            <View style={styles.iconTextContainer}>
                <Icon
                    source="translate"
                    color={'#e8def8'}
                    size={120}
                />
                <Text style={styles.text}>5 Minute Quiz</Text>
            </View>
            <View style={[styles.content]}>
                <View style={[commonStyles.darkThemeBackground, { marginBottom: 40 }]}>
                    <Button mode="outlined" onPress={() => setModalVisible(true)}>Select Quiz Units</Button>
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
                                            status={selectedUnits[quiz] ? 'checked' : 'unchecked'}
                                            onPress={() => handleUnitToggle(quiz)}
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

                <Button mode="contained" onPress={() => navigation.navigate('Quiz', { questions })}>Start Quiz</Button>
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
        paddingHorizontal: 20,
    },
    text: {
        color: 'white',
        marginBottom: 10,
        fontSize: 16,
    },
    audioToggle: {
        marginVertical: 20,
    },
    segmentedControl: {
        justifyContent: 'center',
        marginTop: 10,
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
        marginTop: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default QuizConfigScreen;
