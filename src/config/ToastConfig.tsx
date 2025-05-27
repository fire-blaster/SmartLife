import {View, Text, StyleSheet} from 'react-native';
import {ToastConfigParams} from 'react-native-toast-message';

export const toastConfig = {
  success: ({text1, text2, ...rest}: ToastConfigParams<any>) => (
    <View style={styles.container}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.text}>{text2}</Text>
    </View>
  ),
  error: ({text1, text2, ...rest}: ToastConfigParams<any>) => (
    <View style={[styles.container, {backgroundColor: '#F44336'}]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.text}>{text2}</Text>
    </View>
  ),
  info: ({text1, text2, ...rest}: ToastConfigParams<any>) => (
    <View style={[styles.container, {backgroundColor: '#2196F3'}]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.text}>{text2}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
  },
});
