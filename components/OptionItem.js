import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Text } from 'react-native-paper';

const commonSpringLayout = Layout.springify().mass(0.8).stiffness(200).damping(15);

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
        <TouchableOpacity onPress={() => onSelect(item)}>
            <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                layout={commonSpringLayout}
                style={[styles.optionItem, { backgroundColor }]}
            >
                <Text style={styles.optionText}>{item}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
});

export default OptionItem;