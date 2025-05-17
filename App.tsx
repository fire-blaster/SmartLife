import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Login from './src/screens/Login/Login';
import {ThemeProvider} from './src/Contexts/ThemeContext';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Home from './src/screens/Home/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './src/constants/Navigations';
import {NavigationContainer} from '@react-navigation/native';
import Register from './src/screens/Register/Register';
const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  console.log('user===>', user);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <ThemeProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={user ? 'HOME' : 'LOGIN'}>
          <Stack.Screen name={'LOGIN'} component={Login} />
          <Stack.Screen name={'SIGNUP'} component={Register} />
          <Stack.Screen name={'HOME'} component={Home} />
        </Stack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
