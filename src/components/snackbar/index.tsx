// SnackBar.tsx
import React from 'react';
import useSnackBar from './useSnackBar';
import {Portal, Snackbar, Text} from 'react-native-paper';
import {StyleSheet} from 'react-native';

const SnackBar = () => {
  const {visible, onDismissSnackBar, message, severity} = useSnackBar();

  // Define background colors based on severity
  const getBackgroundColor = () => {
    switch (severity) {
      case 'error':
        return '#E50046'; // Red
      case 'info':
        return '#A1E3F9'; // Blue
      case 'success':
        return '#9DC08B'; // Green
      case 'warning':
        return '#FFAB5B'; // Orange
      default:
        return '#333333'; // Default color
    }
  };

  const getTextColor = () => {
    switch (severity) {
      case 'error':
        return '#FFFFFF'; // White
      case 'success':
        return '#FFFFFF'; // White
      case 'warning':
        return '#000000'; // Black
      default:
        return '#FFFFFF'; // Default color
    }
  };

  return (
    <Portal>
      <Snackbar
        style={[styles.container, {backgroundColor: getBackgroundColor()}]}
        children={<Text style={{color: getTextColor()}}>{message}</Text>}
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={2000}
        action={{
          label: 'Dismiss',
          labelStyle: {color: getTextColor()},
        }}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default SnackBar;
