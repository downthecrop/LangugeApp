import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Button } from 'react-native'; // Import Button from react-native
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import { List, Divider, Avatar, Text, useTheme, MD3Colors, Checkbox, Switch } from 'react-native-paper';
import { commonStyles } from '../styles/CommonStyles';
import useStore from '../store/store';

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

  const backupQuizScores = async () => {
    try {
      console.log('Starting backupQuizScores function');
      const currentUser = await GoogleSignin.getCurrentUser();
      if (!currentUser) {
        console.log('No current user found. Please ensure the user is signed in.');
        return; // Exit the function if no user is signed in
      }
      const userId = currentUser?.user?.id;
      console.log(`Current User ID: ${userId}`);
  
      if (!userId) {
        console.log('User ID is undefined or null. Check the Google Sign-In configuration.');
        return; // Exit the function if user ID is not available
      }
  
      console.log('Attempting to retrieve quizScores from Zustand store');
      const quizScores = useStore.getState().quizScores;
      if (!quizScores) {
        console.log('Quiz scores are undefined or null. Check the Zustand store configuration.');
        return; // Exit the function if quizScores are not available
      }
  
      console.log(`Attempting to backup quiz scores for user ID: ${userId}`);
      await firestore()
        .collection('quizScores')
        .doc(userId)
        .set(quizScores);
      console.log('Quiz scores backed up successfully.');
    } catch (error) {
      console.error('Error in backupQuizScores function:', error);
    }
  };
  

  const restoreQuizScores = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    const userId = currentUser?.user?.id;
  
    if (userId) {
      firestore()
        .collection('quizScores')
        .doc(userId)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            const quizScores = documentSnapshot.data();
            useStore.getState().setQuizScores(quizScores); // Assuming you have a `setQuizScores` action in your store
            console.log('Quiz scores restored successfully.');
          }
        })
        .catch((error) => console.error('Error restoring quiz scores:', error));
    }
  };
  

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
                left={() => <List.Icon color={colors.primary} icon="account-arrow-down" />}
              />
              <List.Item
                title="Rest Progress"
                description="Clear learning progress and hi-scores"
                left={() => <List.Icon color={colors.primary} icon="delete-forever" />}
              />
            </List.Section>
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
