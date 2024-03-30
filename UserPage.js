import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native'; // Import Button from react-native
import { Text } from 'react-native-paper';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import useStore from './store';
import { List, MD3Colors } from 'react-native-paper';
import { commonStyles } from './CommonStyles';

GoogleSignin.configure({
  webClientId: '657297089143-3t2me6899c1flplc8repopjs1qlapge4.apps.googleusercontent.com',
});

const UserPage = () => {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

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
      setUserInfo(null); // Remove user info from state, effectively 'unauthenticating' the user
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <View style={[commonStyles.defaultContainer, commonStyles.darkThemeBackground]}>
      {userInfo ? (
        <>
          <Text style={styles.userInfo}>Welcome, {userInfo.user.name}!</Text>
          <Text style={styles.userInfo}>Email: {userInfo.user.email}</Text>
          <Button title="Sign Out" onPress={_signOut} />
        </>
      ) : (
        <>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={_signIn}
            disabled={isSigninInProgress}
          />
          <Text style={styles.text}>Please sign in</Text>
        </>
      )}
    </View>
    <List.Section>
    <List.Subheader>Some title</List.Subheader>
    <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
    <List.Item
      title="Second Item"
      left={() => <List.Icon color={MD3Colors.tertiary70} icon="folder" />}
    />
  </List.Section>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color:'white',
    fontSize: 20,
  },
  userInfo: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default UserPage;
