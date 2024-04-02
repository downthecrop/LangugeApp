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
        quizScores: {},
        darkModeTheme: true,
        sfxEnabled: true,

        setScore: (quizTitle, score, maxScore) => set((state) => ({
            quizScores: {
                ...state.quizScores,
                [quizTitle]: `${score}/${maxScore}`,
            },
        })),

        toggleDarkModeTheme: () => set((state) => ({
            darkModeTheme: !state.darkModeTheme,
        })),

        toggleSfx: () => set((state) => ({
            sfxEnabled: !state.sfxEnabled,
        })),

        setQuizScores: (newScores) => set(() => ({
            quizScores: newScores,
        })),        

        getScore: (quizTitle) => state.quizScores[quizTitle],
    }),
    {
        name: 'quizScoresStorage',
        storage,
    }
));

export default useStore;
