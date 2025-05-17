import {
  Alert,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ImageComp from '../../components/ImageComp/ImageComp';
import {Images} from '../../assets/images/Images';
import {Strings} from '../../constants/Strings';
import {useTheme} from '../../Contexts/ThemeContext';
import TextInputComp from '../../components/TextInputComp/TextInputComp';
import ButtonComp from '../../components/ButtonComp/ButtonComp';
import {emailRegex, passwordRegex} from '../../validations/Validation';
import auth from '@react-native-firebase/auth';
import {lightTheme} from '../../Themes/Themes';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../constants/Navigations';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';

const Login: React.FC = () => {
  type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'LOGIN'>;

  const navigation = useNavigation<NavigationProps>();
  const {theme} = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<{emailErr: string; passErr: string}>({
    emailErr: '',
    passErr: '',
  });

  const handleForgotPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Success', 'Password reset email sent!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogin = async () => {
    let hasError = false;

    if (!email) {
      setErrors(prev => ({...prev, emailErr: 'Email is required.'}));
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setErrors(prev => ({...prev, emailErr: 'Invalid email!'}));
      hasError = true;
    } else {
      setErrors(prev => ({...prev, emailErr: ''}));
    }

    if (!password) {
      setErrors(prev => ({...prev, passErr: 'Password is required.'}));
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      setErrors(prev => ({
        ...prev,
        passErr:
          'Password must be at least 8 characters and include at least one uppercase, one lowercase, one number, and one special character.',
      }));
      hasError = true;
    } else {
      setErrors(prev => ({...prev, passErr: ''}));
    }

    if (hasError) return;

    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      console.log('User logged in:', result.user.email);
      console.log('Logging in...');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  const handleSignUp = async () => {
    navigation.navigate('SIGNUP');
  };
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
      <Text style={[styles.loginText, {color: theme.text}]}>
        {Strings.LOGIN}
      </Text>
      <TextInputComp
        inputContainer={styles.inputContainer}
        placeholder={Strings.EMAIL}
        placeholderTextColor={theme.textSecondary}
        inputStyle={[{color: theme.text}]}
        onChangeText={(text: string) => {
          setEmail(text);
          setErrors({...errors, emailErr: ''});
        }}
        val={email}
        err={errors.emailErr}
      />
      <TextInputComp
        inputContainer={[styles.inputContainer]}
        placeholder={Strings.PASSWORD}
        placeholderTextColor={theme.textSecondary}
        inputStyle={[{color: theme.text}]}
        onChangeText={(text: string) => {
          setPassword(text);
          setErrors({...errors, passErr: ''});
        }}
        val={password}
        secureTextEntry={!visible}
        password
        visible={visible}
        handlePress={() => {
          setVisible(!visible);
        }}
        err={errors.passErr}
      />
      <TouchableOpacity
        style={styles.forgotContainer}
        onPress={handleForgotPassword}>
        <Text style={{color: lightTheme.primary}}>
          {Strings.FORGOT_PASSWORD}
        </Text>
      </TouchableOpacity>

      <ButtonComp
        btnContainer={styles.buttonContainer}
        buttonString={Strings.LOGIN}
        btnText={{color: theme.text}}
        handlePress={handleLogin}
      />
      <Text style={[styles.orText, {color: theme.text}]}>
        {Strings.OR}
        <Text style={{color: lightTheme.primary}} onPress={handleSignUp}>
          {` ${Strings.SIGNUP}`}
        </Text>
      </Text>
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
  forgotContainer: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },

  buttonContainer: {
    marginTop: 20,
  },
  orText: {
    marginTop: 10,
  },
});
