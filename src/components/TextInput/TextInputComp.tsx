import React from 'react';
import {
  View,
  ViewStyle,
  TextInput,
  StyleProp,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import {styles} from './style';
import ImageComp from '../ImageComp/ImageComp';
import {Images} from '../../assets/images/Images';

interface TextCompProps {
  inputContainer?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  placeholder?: string;
  placeholderTextColor?: string;
  val?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  password?: boolean;
  visible?: boolean;
  handlePress?: () => void;
}

const TextInputComp: React.FC<TextCompProps> = ({
  inputContainer,
  inputStyle,
  placeholder,
  placeholderTextColor,
  val,
  onChangeText,
  secureTextEntry,
  password,
  visible,
  handlePress,
}) => {
  return (
    <View style={[styles.inputContainer, inputContainer]}>
      <TextInput
        style={[styles.inputStyle, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={val}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {password && (
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          style={styles.eyeContainer}>
          <ImageComp
            source={visible ? Images.EYE_OFF : Images.EYE_ON}
            imgStyle={styles.eye}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextInputComp;
