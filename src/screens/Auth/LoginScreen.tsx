import React, { useState, useMemo } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../../theme/ThemeProvider';
import useLogin from './useLogin';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [width] = useState(new Animated.Value(50));
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { Colors } = useTheme();

  const {
    customerData: { CustomerCode, UserName, Password },
    errors,
    updateCustomerData,
    handleLogin,
    loginResult,
  } = useLogin();

  const inputStyle = useMemo(
    () => [styles.input, { color: Colors.text }],
    [Colors.text]
  );

  const handleLoginPress = () => handleLogin(navigation);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Welcome to the app</Text>

            <View style={styles.formContainer}>
              {[
                { label: 'Customer Code', value: CustomerCode, key: 'CustomerCode' },
                { label: 'Username', value: UserName, key: 'UserName' },
                { label: 'Password', value: Password, key: 'Password', secure: true },
              ].map(({ label, value, key, secure }) => (
                <View key={key} style={styles.inputContainer}>
                  <Text style={styles.label}>{label}</Text>
                  <View style={secure ? styles.passwordContainer : undefined}>
                    <TextInput
                      style={inputStyle}
                      placeholder={`Enter your ${label.toLowerCase()}`}
                      placeholderTextColor="#808080"
                      value={value}
                      autoCapitalize={key === 'CustomerCode' ? 'characters' : 'none'}
                      secureTextEntry={secure && !passwordVisible}
                      onChangeText={(text) => updateCustomerData({ [key]: text.trim() })}
                    />
                    {secure && (
                      <Pressable
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={styles.eyeIcon}
                      >
                        <MaterialCommunityIcons
                          name={passwordVisible ? 'eye-off' : 'eye'}
                          size={24}
                          color="#808080"
                        />
                      </Pressable>
                    )}
                  </View>
                  {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
                </View>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
            <Animated.View style={[styles.animatedView, { width }]}>
              {loginResult.isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <MaterialCommunityIcons name="arrow-right-thin" size={24} color="#fff" />
              )}
            </Animated.View>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center' },
  welcomeText: { marginBottom: 20, fontSize: 18, fontWeight: 'bold' },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 20,
    shadowColor: Platform.select({ ios: '#000', android: 'transparent' }),
  },
  inputContainer: { marginTop: 10 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#fff',
  },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  eyeIcon: { position: 'absolute', right: 10, top: 12 },
  errorText: { color: 'red', fontSize: 12 },
  buttonContainer: { marginTop: 60, width: '100%', alignItems: 'center' },
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
    left: 10,
    zIndex: 10,
  },
  buttonText: { fontSize: 20, color: '#000', fontWeight: '600', textAlign: 'center', marginLeft: 10 },
});

export default LoginScreen;
