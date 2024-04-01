import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Button } from 'react-native'; // Import Button from react-native
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { List, Divider, Avatar, Text, useTheme, MD3Colors, Checkbox, Switch } from 'react-native-paper';
import { commonStyles } from '../styles/CommonStyles';
import useStore from '../store/store';

GoogleSignin.configure({
  webClientId: '657297089143-3t2me6899c1flplc8repopjs1qlapge4.apps.googleusercontent.com',
});


const SettingsCard = ({ title, description, value, onToggle }) => {
  const { colors } = useTheme();
  return (
    <List.Item
      title={title}
      description={description}
      left={() => <List.Icon color={colors.primary} icon="bell" />}
      right={props => <Switch status={value ? 'checked' : 'unchecked'} onPress={onToggle} />}
      style={styles.card}
    />
  );
};

const UserPage = () => {
  const { colors } = useTheme();
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(false);
  const toggleSoundEffects = () => setSoundEffectsEnabled(!soundEffectsEnabled);

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
        <SafeAreaView>
          <ScrollView style={styles.topMargin}>
            <>
              {userInfo == null ? (
                <>
                  <View style={styles.headerContainer}>
                    <Avatar.Image size={50} source={require('../../assets/korean-flag.jpg')} />
                    <View style={styles.headerTextContainer}>
                      <Text style={styles.nameText}>{userInfo?.user.name}EXAMPLE</Text>
                      <Button title="Sign Out" style={styles.statusText}></Button>
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
              description="Play sound Effects"
              value={soundEffectsEnabled}
              onToggle={toggleSoundEffects}
            />
            <List.Section>
              <List.Item
                title="Account"
                description="Security notifications, change number"
                left={() => <List.Icon color={colors.primary} icon="account" />}
              />
              <List.Item
                title="Privacy"
                description="Block contacts, disappearing messages"
                left={() => <List.Icon color={colors.primary} icon="lock" />}
              />
              <List.Item
                title="Avatar"
                description="Create, edit, profile photo"
                left={() => <List.Icon color={colors.primary} icon="face" />}
              />
              <List.Item
                title="Chats"
                description="Theme, wallpapers, chat history"
                left={() => <List.Icon color={colors.primary} icon="message" />}
              />
              <List.Item
                title="Notifications"
                description="Message, group & call tones"
                left={() => <List.Icon color={colors.primary} icon="bell" />}
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
