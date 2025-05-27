import {
  ActivityIndicator,
  Image,
  ImageStyle,
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
  loader?: boolean;
  imgButton?: boolean;
  src?: any;
  imgButtonStyle?: StyleProp<ImageStyle>;
}

const ButtonComp: React.FC<ButtonCompProps> = ({
  btnContainer,
  btnText,
  buttonString,
  handlePress,
  loader,
  imgButton,
  src,
  imgButtonStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, btnContainer]}
      activeOpacity={0.7}
      onPress={handlePress}>
      {loader ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : imgButton ? (
        <Image source={src} style={imgButtonStyle} />
      ) : (
        <Text style={[styles.buttonText, btnText]}>{buttonString}</Text>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(ButtonComp);
