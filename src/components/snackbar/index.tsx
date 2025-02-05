import React from 'react';
import useSnackBar from './useSnackBar';
import {Portal, Snackbar} from 'react-native-paper';
import {StyleSheet} from 'react-native';

const SnackBar = () => {
  const {visible, onDismissSnackBar, message} = useSnackBar();
  return (
    <Portal>
      <Snackbar
        style={styles.container}
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={2000}
        action={{
          label: 'Dismiss',
        }}>
        {message}
      </Snackbar>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default SnackBar;
