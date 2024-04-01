import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Button } from 'react-native'; // Import Button from react-native
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
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
      right={props => { onToggle != null ? <Switch status={value ? 'checked' : 'unchecked'} onPress={onToggle} /> : null } }
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
              description="Play sound effects"
              value={soundEffectsEnabled}
              icon="bell"
              onToggle={toggleSoundEffects}
            />
            <List.Section>
              <List.Item
                title="Account"
                description="Backup or Restore learning progress"
                left={() => <List.Icon color={colors.primary} icon="account" />}
              />
              <List.Item
                title="Rest Progress"
                description="Clear learning progress and hi-scores"
                left={() => <List.Icon color={colors.primary} icon="delete-forever" />}
              />
              <List.Item
                title="Theme"
                description="Toggle Light and Dark Modes"
                left={() => <List.Icon color={colors.primary} icon="theme-light-dark" />}
              />
            </List.Section>
            <SettingsCard
              title="Theme"
              description="Toggle Light and Dark Modes"
              value={soundEffectsEnabled}
              icon="theme-light-dark"
            />
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
