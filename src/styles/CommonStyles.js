import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  darkThemeBackground: {
    backgroundColor: '#1c1b1f',
  },
  lightText: {
    color: '#fdfffc',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  optionItem: {
    backgroundColor: '#2c3848',
    padding: 10,
    borderRadius: 4,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fdfffc',
    marginBottom: 20,
  },
  summaryScore: {
    fontSize: 20,
    color: '#fdfffc',
    marginBottom: 20,
  },
  optionText: {
    color: '#f9feff',
    fontSize: 18,
  },
  styledButton: {
    backgroundColor: '#d0bcff',
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#381e72',
  },
  defaultContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1c1b1f',
  }
});
