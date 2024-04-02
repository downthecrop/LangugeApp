import React, { useEffect, useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';

const CountdownTimerBar = ({ duration }) => {
    const [timer, setTimer] = useState(duration);
    const width = useSharedValue(100);

    useEffect(() => {
        width.value = withTiming(0, { duration: duration * 1000 });

        const intervalId = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(intervalId);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [duration]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${width.value}%`,
        };
    });

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, animatedStyle]} />
        </View>
    );
}

const styles = StyleSheet.create({
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
});

export default CountdownTimerBar;
