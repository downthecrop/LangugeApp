import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const SummaryScreen = ({ route, navigation }) => {
  const { score, totalQuestions } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Summary</Text>
      <Text style={styles.scoreText}>You scored {score} out of {totalQuestions}</Text>
      <Button title="Retake Quiz" onPress={() => navigation.popToTop()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#041121',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fdfffc',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    color: '#fdfffc',
    marginBottom: 20,
  },
});

export default SummaryScreen;
