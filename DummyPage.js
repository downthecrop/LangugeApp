import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DummyPage2 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Dummy Page 2</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default DummyPage2;
