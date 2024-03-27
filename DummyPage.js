import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '657297089143-3t2me6899c1flplc8repopjs1qlapge4.apps.googleusercontent.com', // Replace with your actual web client ID
});

const DummyPage2 = () => {
  const [userEmail, setUserEmail] = useState('');

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserEmail(userInfo.user.email); // Update state with the user's email
    } catch (error) {
      console.error(error);
      setUserEmail(''); // Reset or handle error appropriately
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserEmail(''); // User is signed out
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {userEmail ? (
        <>
          <Text style={styles.text}>Signed in as: {userEmail}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </>
      ) : (
        <>
          <Text style={styles.text}>This is Dummy Page 2</Text>
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default DummyPage2;
