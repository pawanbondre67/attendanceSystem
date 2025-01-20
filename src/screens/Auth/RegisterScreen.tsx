import {
  View,
  Text,
  Animated,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../types/types';
import {useTheme} from '../../theme/ThemeProvider';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [width] = useState(new Animated.Value(50)); // Initial width
  const [opacity] = useState(new Animated.Value(1)); // Initial opacity
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(width, {
        toValue: 300, // Expanded width
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0, // Hide text
        duration: 10,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setTimeout(() => {
        navigation.navigate('camera');
      }, 300);
    });
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(width, {
        toValue: 50, // Original width
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1, // Show text
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const {Colors, dark} = useTheme();
  console.log('Current theme', dark);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <View style={styles.welcomeContainer}>
            <Text>Welcome , to the app </Text>
          </View>
          {/* <KeyboardAvoidingView behavior="height"> */}

          <View style={styles.overlay}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[styles.input, {color: Colors.text}]}
                placeholder="Enter your username"
                placeholderTextColor="#808080"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, {color: Colors.text}]}
                  placeholder="Enter your password"
                  placeholderTextColor="#808080"
                  value={password}
                  textContentType="password"
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <Pressable
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIconContainer}>
                  <MaterialCommunityIcons
                    name={passwordVisible ? 'eye-off' : 'eye'}
                    size={24}
                    color="#808080"
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.buttonContainer}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.button}>
          <Animated.View style={[styles.animatedView, {width}]}>
            <MaterialCommunityIcons
              name="arrow-right-thin"
              size={24}
              color="#fff"
            />
          </Animated.View>
          <Animated.Text style={[styles.text, {opacity}]}>
            {' '}
            slide to procced
          </Animated.Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer:{
    alignItems:'center',
    marginBottom:20
  },
  overlay: {
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 350,
    // alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 5,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 20,
  },
  inputContainer: {
    gap: 10,
    // marginTop: 20,
  },
  label: {
    fontSize: 16,
    // marginBottom: 5,
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 17, // Align the icon vertically within the input field
  },
  buttonContainer: {
    marginTop: 60,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  animatedView: {
    height: 48,
    backgroundColor: '#34D399',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // justifyContent: 'center',
    left: 10,
    zIndex: 10,
  },
  text: {
    fontSize: 20,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
    zIndex: 20,
    marginLeft: 50,
  },
});

export default RegisterScreen;
