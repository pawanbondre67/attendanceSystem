import {
  View,
  Text,
  Animated,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
// import {NavigationProp, useNavigation} from '@react-navigation/native';
// import {RootStackParamList} from '../../types/types';
import {useTheme} from '../../theme/ThemeProvider';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {useAuth} from '../../context/AuthProvider';
import useLogin from './useLogin';
import {ActivityIndicator} from 'react-native-paper';

const LoginScreen = ({navigation}: {navigation: any}) => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [width] = useState(new Animated.Value(50));

  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    customerData: {CustomerCode , UserName, Password},
    errors,
    updateCustomerData,
    handleLogin,
    loginResult,
  } = useLogin();

  const {Colors} = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.linearGradient}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View>
            <View style={styles.welcomeContainer}>
              <Text>Welcome , to the app </Text>
            </View>
            {/* <KeyboardAvoidingView behavior="height"> */}

            <View style={styles.overlay}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Customer Code</Text>
                <TextInput
                  style={[styles.input, {color: Colors.text}]}
                  placeholder="Enter your customerCode"
                  placeholderTextColor="#808080"
                  value={CustomerCode}
                  autoCapitalize="characters"
                  onChangeText={text => {
                    updateCustomerData({CustomerCode: text.trim()});
                  }}
                />
                {errors.CustomerCode ? (
                  <Text style={styles.errorText}>{errors.CustomerCode}</Text>
                ) : null}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={[styles.input, {color: Colors.text}]}
                  placeholder="Enter your username"
                  placeholderTextColor="#808080"
                  value={UserName}
                  onChangeText={text => {
                    updateCustomerData({UserName: text.trim()});
                  }}
                />
                {errors.UserName ? (
                  <Text style={styles.errorText}>{errors.UserName}</Text>
                ) : null}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, {color: Colors.text}]}
                    placeholder="Enter your password"
                    placeholderTextColor="#808080"
                    value={Password}
                    textContentType="password"
                    onChangeText={text => {
                      updateCustomerData({Password: text.trim()});
                    }}
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
                {errors.Password ? (
                  <Text style={styles.errorText}>{errors.Password}</Text>
                ) : null}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleLogin(navigation)}
            style={styles.button}>
            <Animated.View style={[styles.animatedView, {width}]}>
              {loginResult.isLoading ? (
                <ActivityIndicator color="#fff" size={'small'} />
              ) : (
                <MaterialCommunityIcons
                  name="arrow-right-thin"
                  size={24}
                  color="#fff"
                />
              )}
            </Animated.View>

            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    backgroundColor: Platform.select({
      ios: '#F5F5F5', // Light background for iOS
      android: '#F5F5F5', // Slightly darker background for Android
    }),
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overlay: {
    padding: 20,
    paddingBottom: 40,
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
    shadowColor: Platform.select({
      ios: '#000', // Subtle shadow for iOS
      android: 'transparent', // Use elevation for Android
    }),
  },
  inputContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    width: '100%',
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
    top: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
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
    marginLeft: 10,
  },
});

export default LoginScreen;
