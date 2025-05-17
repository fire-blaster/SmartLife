import {ImageStyle, View, ViewStyle, Image} from 'react-native';
import React from 'react';
import {styles} from './style';

interface ImageCompProps {
  imgContainer?: ViewStyle;
  imgStyle?: ImageStyle;
  source?: any;
}

const ImageComp: React.FC<ImageCompProps> = ({
  imgContainer,
  imgStyle,
  source,
}) => {
  return (
    <View style={[styles.imageContainer, imgContainer]}>
      <Image source={source} style={[styles.imageStyle, imgStyle]} />
    </View>
  );
};

export default ImageComp;
