import {
  useNavigation,
  NavigationProp,
  CommonActions,
} from '@react-navigation/native';
import {RootStackParamList} from '../../types/types'; // Adjust the path as necessary
import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useAuth} from '../../context/AuthProvider';

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {isAuthenticated} = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
        navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'home'}],
            }),
          );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'register'}],
        }),
      );
    }
  }, [isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
