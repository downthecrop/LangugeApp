import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, { Layout, FadeOut, FadeIn } from 'react-native-reanimated';

const OptionItem = ({ item, onRemove, onAdd }) => {
  const handlePress = () => {
    if (onRemove) {
      onRemove(item);
    } else if (onAdd) {
      onAdd(item);
    }
  };

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout.springify().damping(50)}
      style={styles.optionItem}
    >
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.optionText}>{item}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const App = () => {
  const [options, setOptions] = useState(['받침', '더', '제시해', '주세요', '드세요', '잠']);
  const [answers, setAnswers] = useState([]);

  const removeOption = (optionToRemove) => {
    setOptions(options.filter(option => option !== optionToRemove));
    setAnswers([...answers, optionToRemove]);
  };

  const addOption = (optionToAdd) => {
    setAnswers(answers.filter(answer => answer !== optionToAdd));
    setOptions([...options, optionToAdd]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { marginTop: 20 }]}>Answers</Text>
      <View style={[styles.optionsContainer, {    borderBottomColor: 'white',
    borderBottomWidth: 1}]}>
        {answers.map((answer) => (
          <OptionItem key={answer} item={answer} onAdd={addOption} />
        ))}
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <OptionItem key={option} item={option} onRemove={removeOption} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#041121',
  },
  title: {
    color: '#fdfffc',
    fontSize: 24,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    minHeight: 50,
  },
  optionItem: {
    backgroundColor: '#2c3848',
    padding: 10,
    borderRadius: 4,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: '#f9feff',
    fontSize: 18,
  },
});

export default App;
