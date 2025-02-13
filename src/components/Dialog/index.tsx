import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import useLocalStorage from '../../screens/home/useLocalStorage';

type LogoutDialogProps = {
  visible: boolean;
  hideDialog: () => void;
  navigation: any;
};
const LogoutDialog = ({visible, hideDialog, navigation}: LogoutDialogProps) => {
  const {deleteEmployeeDetails} = useLocalStorage({navigation});

  const Logout = () => {
    hideDialog();
    deleteEmployeeDetails();
  };

  return (
    <View>
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={styles.container}>
          <Dialog.Title style={{color:'#fff'}}>Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{color:'#fff'}}>Are you sure you want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={styles.button} onPress={Logout}>
              <Text style={{color:'#fff'}}>Yes</Text>
            </Button>
            <Button style={styles.button} onPress={hideDialog}>
              <Text style={{color:'#fff'}}>Cancel</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#27445D',
    padding: 10,
    borderRadius: 10,
  },
  button: {
    // margin: ,
    paddingHorizontal: 10,
    // backgroundColor: '#F8FAFC',
    // borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F8FAFC',

  },
});

export default LogoutDialog;
