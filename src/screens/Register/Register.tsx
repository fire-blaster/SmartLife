import {KeyboardAvoidingView, ScrollView, StyleSheet, Text} from 'react-native';
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
import {storage} from '../../storage/storage';
import Toast from 'react-native-toast-message';

const Register: React.FC = () => {
  type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    'SIGNUP'
  >;

  const navigation = useNavigation<NavigationProps>();
  const {theme} = useTheme();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [visiblePass, setVisiblePass] = useState<boolean>(false);
  const [visibleConfirmPass, setVisibleConfirmPass] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    nameErr: string;
    emailErr: string;
    passErr: string;
    confirmPassErr: string;
  }>({
    nameErr: '',
    emailErr: '',
    passErr: '',
    confirmPassErr: '',
  });

  const handleLogin = async () => {
    navigation.navigate('LOGIN');
  };

  const handleSignUp = async () => {
    let hasError = false;

    if (!name) {
      setErrors(prev => ({...prev, nameErr: 'Name is required.'}));
      hasError = true;
    } else {
      setErrors(prev => ({...prev, nameErr: ''}));
    }

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

    if (confirmPassword !== password) {
      setErrors(prev => ({...prev, confirmPassErr: 'Passwords do not match!'}));
      hasError = true;
    } else {
      setErrors(prev => ({...prev, confirmPassErr: ''}));
    }

    if (hasError) return;

    setLoader(true);
    try {
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await result.user.updateProfile({displayName: name});

      const userData = {
        userName: name,
        userEmail: email,
      };
      storage.set('userData', JSON.stringify(userData));
      navigation.navigate('HOME');
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      console.error('Register failed:', error);
    } finally {
      setLoader(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: theme.background}}
      behavior="padding"
      keyboardVerticalOffset={0}>
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
          {Strings.SIGNUP}
        </Text>
        <TextInputComp
          inputContainer={styles.inputContainer}
          placeholder={Strings.NAME}
          placeholderTextColor={theme.textSecondary}
          inputStyle={[{color: theme.text}]}
          onChangeText={(text: string) => {
            setName(text);
            setErrors({...errors, nameErr: ''});
          }}
          val={name}
          err={errors.nameErr}
        />
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
          secureTextEntry={!visiblePass}
          password
          visible={visiblePass}
          handlePress={() => {
            setVisiblePass(!visiblePass);
          }}
          err={errors.passErr}
        />

        <TextInputComp
          inputContainer={[styles.inputContainer]}
          placeholder={Strings.CONFIRM_PASSWORD}
          placeholderTextColor={theme.textSecondary}
          inputStyle={[{color: theme.text}]}
          onChangeText={(text: string) => {
            setConfirmPassword(text);
            setErrors({...errors, confirmPassErr: ''});
          }}
          val={confirmPassword}
          secureTextEntry={!visibleConfirmPass}
          password
          visible={visibleConfirmPass}
          handlePress={() => {
            setVisibleConfirmPass(!visibleConfirmPass);
          }}
          err={errors.confirmPassErr}
        />

        <ButtonComp
          btnContainer={styles.buttonContainer}
          buttonString={Strings.SIGNUP}
          btnText={{color: theme.text}}
          handlePress={handleSignUp}
          loader={loader}
        />
        <Text style={[styles.orText, {color: theme.text}]}>
          {Strings.ALREADY_HAVE_ACCOUNT}
          <Text style={{color: lightTheme.primary}} onPress={handleLogin}>
            {` ${Strings.LOGIN}`}
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
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

  buttonContainer: {
    marginTop: 20,
  },
  orText: {
    marginTop: 10,
  },
});
