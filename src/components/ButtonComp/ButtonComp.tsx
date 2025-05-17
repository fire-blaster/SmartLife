import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {styles} from './style';

interface ButtonCompProps {
  btnContainer?: StyleProp<ViewStyle>;
  btnText?: StyleProp<TextStyle>;
  buttonString?: string;
  handlePress?: () => void;
}

const ButtonComp: React.FC<ButtonCompProps> = ({
  btnContainer,
  btnText,
  buttonString,
  handlePress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, btnContainer]}
      activeOpacity={0.7}
      onPress={handlePress}>
      <Text style={[styles.buttonText, btnText]}>{buttonString}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComp;
