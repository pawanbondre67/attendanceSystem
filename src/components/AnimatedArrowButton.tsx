import React from 'react';
import {Text, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/types';

interface AnimatedArrowButtonProps {
  routeName: string;
  submit: () => void; 

}
const AnimatedArrowButton: React.FC<AnimatedArrowButtonProps> = ({
  routeName,  submit,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const translateX = useSharedValue(0); // Shared value to control the arrow's translation

  const onPressIn = () => {
    translateX.value = withTiming(80, {duration: 400}); // Move the arrow 10 units to the right
  };

  const onPressOut = () => {
    translateX.value = withTiming(0, {duration: 600}); // Return the arrow to the original position
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        submit();
        navigation.replace(`${routeName}`);
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <Text style={styles.buttonText}>Done</Text>
      <Animated.View style={animatedStyle}>
        <Icon name="arrow-right" size={20} color="#fff" />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BFA6', // Color from the image
    paddingVertical: 10,
    width: '90%',
    paddingHorizontal: 20,
    gap: 10,
    borderRadius: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10,
  },
});

export default AnimatedArrowButton;
