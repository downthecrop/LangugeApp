import React from 'react';
import { ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import quizData from '../data/QuizData';
import useStore from '../store/store';
import { commonStyles } from '../styles/CommonStyles';
import QuizButton from '../components/QuizButton';

const HomeScreen = () => {
  const navigation = useNavigation();
  const quizScores = useStore(state => state.quizScores);
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1c1b1f" />
      <ScrollView style={[commonStyles.darkThemeBackground, commonStyles.container]} contentContainerStyle={styles.container}>
        {quizData.map((quiz, index) => {
          const scoreString = quizScores[quiz.title];
          const [score, maxScore] = scoreString ? scoreString.split('/').map(Number) : [0, quiz.questions.length];
          const rating = (score / maxScore) * 5;
          console.log("Score for", quiz.title, score, rating)
          return (
            <QuizButton
              key={index}
              quizData={quiz}
              imgUrl={quiz.imgUrl}
              title={quiz.title}
              subTitle={quiz.subTitle}
              navigation={navigation}
              rating={rating}
            />
          );
        })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#1c1b1f',
  },
});

export default HomeScreen;
