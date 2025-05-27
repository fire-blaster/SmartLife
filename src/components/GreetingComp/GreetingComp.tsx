import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {styles} from './style';
import {useTheme} from '../../Contexts/ThemeContext';

interface GreetingComponentProps {
  userName?: string;
}

const GreetingComponent: React.FC<GreetingComponentProps> = ({userName}) => {
  const {theme} = useTheme();
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour: number = new Date().getHours();
      let greetingText: string = '';

      if (currentHour >= 0 && currentHour < 12) {
        greetingText = `Good Morning, ${userName}`;
      } else if (currentHour >= 12 && currentHour < 17) {
        greetingText = `Good Afternoon, ${userName}`;
      } else if (currentHour >= 17 && currentHour < 20) {
        greetingText = `Good Evening, ${userName}`;
      } else {
        greetingText = `Good Night, ${userName}`;
      }

      setGreeting(greetingText);
    };

    // Update greeting immediately and then every minute
    updateGreeting();
    const interval: NodeJS.Timeout = setInterval(updateGreeting, 60000); // Update every 60 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [userName]);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Text style={[styles.greetingText, {color: theme.text}]}>{greeting}</Text>
    </View>
  );
};

export default GreetingComponent;
