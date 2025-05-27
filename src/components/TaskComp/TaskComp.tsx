import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message'; // For error feedback

interface Task {
  taskId: string;
  title: string;
  time: string;
  completed: boolean;
}

const TaskComp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const wellnessTip = '💡 Stay hydrated! Drink 8 glasses today.';

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'Please sign in to view tasks.',
      });
      setLoading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('tasks')
      .where('time', '>=', today.toISOString())
      .where('time', '<', tomorrow.toISOString())
      .onSnapshot(
        snapshot => {
          const fetchedTasks: Task[] = snapshot.docs.map(doc => ({
            taskId: doc.id,
            ...doc.data(),
          })) as Task[];
          setTasks(fetchedTasks.filter(task => !task.completed));
          setLoading(false);
        },
        error => {
          console.error('Firestore error:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to load tasks. Please try again.',
          });
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

  const formatTime = (isoTime: string): string => {
    try {
      const date = new Date(isoTime);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Invalid Time';
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.sectionTitle}>📅 Today’s Schedule</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading tasks...</Text>
      ) : tasks.length === 0 ? (
        <Text style={styles.noTasksText}>No tasks for today!</Text>
      ) : (
        tasks.map(task => (
          <Text key={task.taskId} style={styles.scheduleItem}>
            {formatTime(task.time)} • {task.title}
          </Text>
        ))
      )}
      <Text style={styles.sectionTitle}>🧘 Wellness Boost</Text>
      <Text style={styles.wellnessTip}>{wellnessTip}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
  },
  scheduleItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  wellnessTip: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  noTasksText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default TaskComp;
