import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';

const Spinner = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };

    spin();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.outerCircle, {transform: [{rotate: spin}]}]}>
        <Animated.View
          style={[styles.innerCircle, {transform: [{rotate: spin}]}]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#7886C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 35,
    height: 35,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#E52020',
  },
});

export default Spinner;
