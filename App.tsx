import {View, ActivityIndicator, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Login from './src/screens/Login/Login';
import Register from './src/screens/Register/Register';
import Home from './src/screens/Home/Home';
import {ThemeProvider} from './src/Contexts/ThemeContext';
import {RootStackParamList} from './src/constants/Navigations';
import {toastConfig} from './src/config/ToastConfig';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {CLIENT_ID} from './cred';

const Stack = createNativeStackNavigator<RootStackParamList>();

GoogleSignin.configure({
  webClientId: CLIENT_ID,
});

interface userInfoPayload {
  uid: string;
  email: string | null;
  name: string;
  photo: string | null;
  provider: string;
}
const App = () => {
  const [user, setUser] = useState<
    FirebaseAuthTypes.User | userInfoPayload | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   const unsubscribe = auth().onAuthStateChanged(user => {
  //     console.log('user===>', user);

  //     setUser(user);
  //     setLoading(false);
  //   });
  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        const {displayName, email, uid, photoURL, providerData} = currentUser;

        const isGoogleUser = providerData.some(
          provider => provider.providerId === 'google.com',
        );

        const userInfo: userInfoPayload = {
          uid,
          email,
          name: displayName || '',
          photo: photoURL || null,
          provider: isGoogleUser ? 'google' : 'email',
        };

        console.log('Logged-in user info:', userInfo);
        setUser(userInfo);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <ThemeProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={user ? 'HOME' : 'LOGIN'}>
            <Stack.Screen name="LOGIN" component={Login} />
            <Stack.Screen name="SIGNUP" component={Register} />
            <Stack.Screen name="HOME" component={Home} />
          </Stack.Navigator>
        </ThemeProvider>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

export default App;
