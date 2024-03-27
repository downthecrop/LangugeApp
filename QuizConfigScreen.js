import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Button, Menu, Text, Provider } from 'react-native-paper';
import { commonStyles } from './CommonStyles';
import { SegmentedButtons, Divider, Portal, Modal, Checkbox, Icon } from 'react-native-paper';

import { DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import quizData from './QuizData';

const theme = {
    ...PaperDarkTheme,
    colors: {
        ...PaperDarkTheme,
        primary: '#BB86FC',  // Purple, for example
        accent: '#03DAC6',   // Teal, for example
        background: '#121212', // Dark background
        surface: '#1E1E1E',   // Dark surface
        text: '#FFFFFF',     // White text for readability
        onSurface: 'white',
        // Add other color overrides for dark theme if necessary
    },
};

const QuizConfigScreen = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState({});

    const units = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Unit 6', 'Unit 7', 'Unit 8', 'Unit 9', 'Unit 10', 'Unit 11']; // Example units
    const [value, setValue] = React.useState('train');

    const handleUnitToggle = (unit) => {
        setSelectedUnits(prevUnits => ({
            ...prevUnits,
            [unit]: !prevUnits[unit]
        }));
    };

    return (
        <Provider>
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
                                    {units.map((unit, index) => (
                                        <View key={index} style={styles.modalItem}>
                                            <Text style={styles.text}>{unit}</Text>
                                            <Checkbox
                                                status={selectedUnits[unit] ? 'checked' : 'unchecked'}
                                                onPress={() => handleUnitToggle(unit)}
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
                                theme={theme}
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

                    <Button mode="contained" onPress={() => navigation.navigate('Quiz', { quizData })}>Start Quiz</Button>
                </View>
            </View>
        </Provider>
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
        alignItems: 'center', // Center the icon and text horizontally
        justifyContent: 'center', // Center the icon and text vertically
    },
});

export default QuizConfigScreen;
