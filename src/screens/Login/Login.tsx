import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
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
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  SignInResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {CLIENT_ID} from '../../../cred';

const Login: React.FC = () => {
  type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'LOGIN'>;

  const navigation = useNavigation<NavigationProps>();
  const {theme} = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [googleLoader, setGoogleLoader] = useState<boolean>(false);
  const [errors, setErrors] = useState<{emailErr: string; passErr: string}>({
    emailErr: '',
    passErr: '',
  });

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter an email address.',
      });
      return;
    }
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid email address.',
      });
      return;
    }

    setLoader(true);
    try {
      await auth().sendPasswordResetEmail(email);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset email sent!',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to send password reset email.',
      });
    } finally {
      setLoader(false);
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

    setLoader(true);
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Welcome back, ${result?.user?.email}!`,
      });
      navigation.navigate('HOME');
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
      console.error('Login failed:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SIGNUP');
  };
  const handleGoogleLogin = async () => {
    setGoogleLoader(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const idToken = response.data?.idToken;
        console.log(idToken);
        if (!idToken) {
          throw new Error('No idToken received from Google Sign-In');
        }

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign in with Firebase
        const userCredential = await auth().signInWithCredential(
          googleCredential,
        );

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Welcome, ${userCredential.user.email}!`,
        });
        navigation.navigate('HOME');
      } else {
        // Sign-in was cancelled by user
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Sign-in was cancelled.',
        });
      }
    } catch (error: any) {
      let errorMessage = 'Google login failed. Please try again.';
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            errorMessage = 'Sign-in is already in progress.';
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            errorMessage = 'Google Play Services is not available or outdated.';
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            errorMessage = 'Sign-in was cancelled.';
            break;
          case '12500':
            errorMessage =
              'A non-recoverable sign-in failure occurred. Please check your Google Sign-In configuration.';
            break;
          default:
            errorMessage = `Google Sign-In error: ${error.message}`;
            break;
        }
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage =
          'Invalid Google credential. Please check your configuration.';
      } else {
        errorMessage = 'An unexpected error occurred during Google Sign-In.';
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
      console.error('Google login failed:', {
        code: error.code,
        message: error.message,
      });
    } finally {
      setGoogleLoader(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: theme.background}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {backgroundColor: theme.background},
          ]}>
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
            loader={loader}
          />
          {/* <Text style={{color: theme.text}}>{Strings.OR_TEXT}</Text>
          <ButtonComp
            buttonString={Strings.LOGIN}
            handlePress={handleGoogleLogin}
            loader={googleLoader}
            imgButton
            src={Images.GOOGLE}
            imgButtonStyle={styles.googleButtonStyle}
            btnContainer={[
              styles.googleButtonContainer,
              {backgroundColor: theme.background},
            ]}
          /> */}
          <Text style={[styles.orText, {color: theme.text}]}>
            {Strings.OR}
            <Text style={{color: lightTheme.primary}} onPress={handleSignUp}>
              {` ${Strings.SIGNUP}`}
            </Text>
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  googleButtonStyle: {
    width: 50,
    height: 50,
  },
  googleButtonContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  orText: {
    marginTop: 10,
  },
});
