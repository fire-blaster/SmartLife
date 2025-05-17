import {StyleSheet} from 'react-native';
import {lightTheme} from '../../Themes/Themes';

export const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    backgroundColor: lightTheme.primary,
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
  },
});
