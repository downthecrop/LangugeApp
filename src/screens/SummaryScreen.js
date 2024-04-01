import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles } from '../styles/CommonStyles';

const SummaryScreen = ({ route, navigation }) => {
  const { score, totalQuestions } = route.params;

  return (
    <View style={commonStyles.defaultContainer}>
      <Text style={commonStyles.summaryTitle}>Quiz Summary</Text>
      <Text style={commonStyles.summaryScore}>You scored {score} out of {totalQuestions}</Text>
      <TouchableOpacity style={commonStyles.styledButton} onPress={() => navigation.popToTop()}>
        <Text style={commonStyles.buttonText}>Return Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SummaryScreen;
