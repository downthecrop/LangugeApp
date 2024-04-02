import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Button } from 'react-native'; // Import Button from react-native
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Ensure you have imported Firebase Auth
import { List, Divider, Avatar, Text, useTheme, Switch, Snackbar, Portal } from 'react-native-paper';
import { commonStyles } from '../styles/CommonStyles';
import useStore from '../store/store';
import quizData from '../data/QuizData';

GoogleSignin.configure({
  webClientId: '657297089143-3t2me6899c1flplc8repopjs1qlapge4.apps.googleusercontent.com',
});

const SettingsCard = ({ title, description, value, onToggle, icon }) => {
  const { colors } = useTheme();
  return (
    <List.Item
      title={title}
      description={description}
      left={() => <List.Icon color={colors.primary} icon={icon} />}
      right={() => onToggle && value !== undefined ? <Switch value={value} onValueChange={onToggle} /> : null}
      style={styles.card}
    />
  );
};

const UserPage = () => {
  const { colors } = useTheme();
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const darkThemeEnabled = useStore((state) => state.darkModeTheme);
  const soundEffectsEnabled = useStore((state) => state.sfxEnabled);
  const toggleDarkTheme = useStore((state) => state.toggleDarkModeTheme);
  const toggleSoundEffects = useStore((state) => state.toggleSfx);

  useEffect(() => {
    const checkSignIn = async () => {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        const userInfo = await GoogleSignin.getCurrentUser();
        setUserInfo(userInfo);
      }
    };

    checkSignIn();
  }, []);

  const _signIn = async () => {
    try {
      setIsSigninInProgress(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setIsSigninInProgress(false);
    } catch (error) {
      console.error(error);
      setIsSigninInProgress(false);
    }
  };

  const _signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
    } catch (error) {
      console.error(error);
    }
  };


  /**
    Firestore rule

    service cloud.firestore {
    match /databases/{database}/documents {
      match /quizScores/{userId} {
        allow read, update, delete: if request.auth != null && request.auth.uid == userId;
        allow create: if request.auth != null;
      }
    }
  }

  */

  const backupQuizScores = async () => {
    try {
      console.log('Starting backupQuizScores function');

      // Ensure the user is signed in with Google
      const googleUser = await GoogleSignin.signInSilently(); // This will not prompt the user, but will return the current user
      const googleToken = (await googleUser).idToken; // Get the Google token from the Google User

      // Authenticate with Firebase using the Google Token
      const googleCredential = auth.GoogleAuthProvider.credential(googleToken);
      await auth().signInWithCredential(googleCredential); // This signs the user into Firebase with their Google account

      // Now that the user is authenticated with Firebase, use the Firebase Auth User ID
      const userId = auth().currentUser.uid;
      console.log(`Authenticated Firebase User ID: ${userId}`);

      // Check if we got a user ID
      if (!userId) {
        console.log('Firebase User ID is undefined or null. Check Firebase Authentication.');
        return; // Exit the function if Firebase user ID is not available
      }

      console.log('Attempting to retrieve quizScores from Zustand store');
      const quizScores = useStore.getState().quizScores; // Your existing code to get quizScores

      // Check if quizScores are available
      if (!quizScores) {
        console.log('Quiz scores are undefined or null. Check the Zustand store configuration.');
        return; // Exit the function if quizScores are not available
      }

      console.log(`Attempting to backup quiz scores for Firebase User ID: ${userId}`);
      // Use the Firebase Auth User ID for Firestore operations
      await firestore()
        .collection('quizScores')
        .doc(userId)
        .set(quizScores);

      showSnackMessage('Quiz scores backed up successfully.');

    } catch (error) {
      if (error.code === 'permission-denied') {
        console.log('Permission denied: Ensure the user is authenticated with Firebase and has the correct permissions.');
      }
      if (error.message === 'SIGN_IN_REQUIRED') {
        showSnackMessage('No current user found. Please signin to backup/restore');
      }
    }
  };

  const restoreQuizScores = async () => {

    try {
      // Ensure the user is signed in with Google
      const googleUser = await GoogleSignin.signInSilently(); // This will not prompt the user, but will return the current user
      const googleToken = (await googleUser).idToken; // Get the Google token from the Google User

      // Authenticate with Firebase using the Google Token
      const googleCredential = auth.GoogleAuthProvider.credential(googleToken);
      await auth().signInWithCredential(googleCredential); // This signs the user into Firebase with their Google account

      // Now that the user is authenticated with Firebase, use the Firebase Auth User ID
      const userId = auth().currentUser.uid;
      console.log(`Authenticated Firebase User ID: ${userId}`);

      if (userId) {
        firestore()
          .collection('quizScores')
          .doc(userId)
          .get()
          .then((documentSnapshot) => {
            if (documentSnapshot.exists) {
              const quizScores = documentSnapshot.data();
              console.log("I got back quizdata", quizScores)
              useStore.getState().setQuizScores(quizScores); // Assuming you have a `setQuizScores` action in your store
              console.log('Quiz scores restored successfully.');
            }
          })
          .catch((error) => console.error('Error restoring quiz scores:', error));
      } else {
        showSnackMessage('No current user found. Please signin to backup/restore');
      }
    } catch (error) {
      if (error.code === 'permission-denied') {
        console.log('Permission denied: Ensure the user is authenticated with Firebase and has the correct permissions.');
      }
      if (error.message === 'SIGN_IN_REQUIRED') {
        showSnackMessage('No current user found. Please signin to backup/restore');
      }
    }
  };


  const resetQuizScores = async () => {
    useStore.getState().setQuizScores({});
    console.log("QuizData reset..",useStore.getState().quizScores)
    showSnackMessage('Quiz scores reset successfully.')
  };

  const showSnackMessage = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }



  return (
    <>
      <View style={[commonStyles.defaultContainer, commonStyles.darkThemeBackground]}>
        <SafeAreaView>
          <ScrollView style={styles.topMargin}>
            <>
              {userInfo ? (
                <>
                  <View style={styles.headerContainer}>
                    <Avatar.Image size={50} source={require('../../assets/korean-flag.jpg')} />
                    <View style={styles.headerTextContainer}>
                      <Text style={styles.nameText}>{userInfo?.user.name}</Text>
                      <Button onPress={_signOut} title="Sign Out" style={styles.statusText}></Button>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <GoogleSigninButton
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={_signIn}
                    disabled={isSigninInProgress}
                  />
                </>
              )}
            </>
            <Divider />
            <SettingsCard
              title="Sound Effects"
              description="Play sound effects"
              value={soundEffectsEnabled}
              icon="bell"
              onToggle={toggleSoundEffects}
            />
            <SettingsCard
              title="Dark Theme"
              description="Enable dark theme"
              value={darkThemeEnabled}
              icon="theme-light-dark"
              onToggle={toggleDarkTheme}
            />
            <List.Section>
              <List.Item
                title="Backup Progress"
                description="Backup learning progress"
                left={() => <List.Icon color={colors.primary} icon="account" />}
                onPress={backupQuizScores}
              />
              <List.Item
                title="Restore Progress"
                description="Restore learning progress"
                onPress={restoreQuizScores}
                left={() => <List.Icon color={colors.primary} icon="account-arrow-down" />}
              />
              <List.Item
                title="Rest Progress"
                description="Clear learning progress and hi-scores"
                onPress={resetQuizScores}
                left={() => <List.Icon color={colors.primary} icon="delete-forever" />}
              />
            </List.Section>
            <Portal>
              <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000} // Snackbar will be visible for 3 seconds
              >
                {snackbarMessage}
              </Snackbar>
            </Portal>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topMargin: {
    marginTop: 50,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  userInfo: {
    marginTop: 20,
    fontSize: 18,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  statusText: {
    fontSize: 16,
    color: 'grey',
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
});

export default UserPage;
