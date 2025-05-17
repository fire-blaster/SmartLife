import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ImageComp from '../../components/ImageComp/ImageComp';
import {Images} from '../../assets/images/Images';
import {Strings} from '../../constants/Strings';
import {useTheme} from '../../Contexts/ThemeContext';
import TextInputComp from '../../components/TextInput/TextInputComp';

const Login = () => {
  const {theme} = useTheme();
  const [emai, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);

  console.log(password);
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <ImageComp
        imgContainer={styles.imgContainer}
        imgStyle={styles.imgStyle}
        source={Images.APP_LOGO}
      />
      <Text style={[styles.appNameText, {color: theme.text}]}>
        {Strings.APP_NAME}
      </Text>
      <Text style={[styles.loginText, {color: theme.text}]}>Login</Text>
      <TextInputComp
        inputContainer={styles.inputContainer}
        placeholder={Strings.EMAIL}
        placeholderTextColor={theme.textSecondary}
        inputStyle={[{color: theme.text}]}
        onChangeText={(text: string) => {
          setEmail(text);
        }}
        val={emai}
      />
      <TextInputComp
        inputContainer={[styles.inputContainer]}
        placeholder={Strings.PASSWORD}
        placeholderTextColor={theme.textSecondary}
        inputStyle={[{color: theme.text}]}
        onChangeText={(text: string) => {
          setPassword(text);
        }}
        val={password}
        secureTextEntry={!visible}
        password
        visible={visible}
        handlePress={() => {
          setVisible(!visible);
        }}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  imgContainer: {
    marginTop: 100,
    width: 100,
    height: 100,
  },
  imgStyle: {
    width: 100,
    height: 100,
  },
  appNameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 20,
    justifyContent: 'center',
    padding: 5,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    flexDirection: 'row',
  },
});
