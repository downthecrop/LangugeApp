import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


const storage = {
    getItem: async (name) => {
        const item = await AsyncStorage.getItem(name);
        // Parse the string to an object before returning
        return item ? JSON.parse(item) : null;
    },
    setItem: async (name, value) => {
        // Stringify the value before storing
        const stringValue = JSON.stringify(value);
        await AsyncStorage.setItem(name, stringValue);
    },
    removeItem: (name) => AsyncStorage.removeItem(name),
};


const useStore = create(persist(
    (set) => ({
        counter: 0,
        increaseCounter: () => set((state) => ({ counter: state.counter + 1 })),
        decreaseCounter: () => set((state) => ({ counter: state.counter - 1 })),
    }),
    {
        name: 'counterStorage',
        storage, // Updated to use the new `storage` option
    }
));

export default useStore;
