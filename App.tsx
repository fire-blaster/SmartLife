import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Login from './src/screens/Login/Login';
import {ThemeProvider} from './src/Contexts/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <Login />
    </ThemeProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
