import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
    getItem: async (name) => {
        const item = await AsyncStorage.getItem(name);
        return item ? JSON.parse(item) : null;
    },
    setItem: async (name, value) => {
        const stringValue = JSON.stringify(value);
        await AsyncStorage.setItem(name, stringValue);
    },
    removeItem: (name) => AsyncStorage.removeItem(name),
};

const useStore = create(persist(
    (set) => ({
        quizScores: {}, // Object to hold scores for quizzes, identified by title
        setScore: (quizTitle, score, maxScore) => set((state) => ({
            quizScores: {
                ...state.quizScores,
                [quizTitle]: `${score}/${maxScore}`, // Store score and maxScore as a string
            },
        })),
        getScore: (quizTitle) => state.quizScores[quizTitle], // Function to retrieve the score by quiz title
    }),
    {
        name: 'quizScoresStorage',
        storage,
    }
));

export default useStore;
