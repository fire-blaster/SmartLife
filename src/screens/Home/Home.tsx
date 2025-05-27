import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../constants/Navigations';
import {storage} from '../../storage/storage';
import GreetingComponent from '../../components/GreetingComp/GreetingComp';
import TaskComp from '../../components/TaskComp/TaskComp';
import ButtonComp from '../../components/ButtonComp/ButtonComp';
import {darkTheme} from '../../Themes/Themes';
import DateTimePicker from '@react-native-community/datetimepicker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import {useTheme} from '../../Contexts/ThemeContext';
import TextInputComp from '../../components/TextInputComp/TextInputComp';

interface userData {
  userName: string;
  userEmail?: string;
}
const Home: React.FC = () => {
  const {theme} = useTheme();
  const [userData, setUserData] = useState<userData | null>(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [newTaskTime, setNewTaskTime] = useState<Date>(new Date());

  type NavigationProps = NativeStackNavigationProp<
    RootStackParamList,
    'SIGNUP'
  >;
  const navigation = useNavigation<NavigationProps>();
  useEffect(() => {
    const storedData: any = storage.getString('userData');
    const data = JSON.parse(storedData);
    setUserData(data);
  }, []);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewTaskTime(selectedDate);
    }
  };

  const addTask = async () => {
    const user = auth().currentUser;
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'Please sign in to add tasks.',
      });
      return;
    }

    if (!newTaskTitle.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Input Error',
        text2: 'Task title cannot be empty.',
      });
      return;
    }

    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('tasks')
        .add({
          title: newTaskTitle.trim(),
          time: newTaskTime.toISOString(),
          completed: false,
        });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Task added successfully!',
      });
      setNewTaskTitle('');
      setNewTaskTime(new Date());
      setTaskModalVisible(false);
    } catch (error) {
      console.error('Error adding task:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add task. Please try again.',
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <GreetingComponent userName={userData?.userName} />
      <TaskComp />
      <ButtonComp
        btnContainer={styles.floatingButtonContainer}
        btnText={styles.floatingTextStyle}
        buttonString="+"
        handlePress={() => {
          setTaskModalVisible(true);
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={taskModalVisible}
        onRequestClose={() => setTaskModalVisible(false)}>
        <View
          style={[styles.modalOverlay, {backgroundColor: theme.background}]}>
          <View
            style={[styles.modalContent, {backgroundColor: theme.background}]}>
            <Text style={[styles.modalTitle, {color: theme.textSecondary}]}>
              Add New Task
            </Text>
            {/* <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            /> */}
            <TextInputComp
              inputContainer={{
                justifyContent: 'center',
                // padding: 5,
                borderColor: 'gray',
                borderWidth: 0.5,
                borderRadius: 10,
                flexDirection: 'row',
              }}
              inputStyle={[{color: theme.text}]}
              placeholder="Task Time"
              placeholderTextColor={theme.textSecondary}
              val={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerText}>
                {newTaskTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newTaskTime}
                mode="time"
                display="default"
                onChange={onDateChange}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setTaskModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addTask}>
                <Text style={styles.buttonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  floatingButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  floatingTextStyle: {
    fontSize: 20,
    width: 30,
    height: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: darkTheme.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
