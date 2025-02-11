import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import useLocalStorage from '../home/useLocalStorage';
import {useAppSelector} from '../../redux/hook/hook';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LogoutDialog from '../../components/Dialog';

const ProfileScreen = ({navigation} :  any) => {
  const [profilePic, setProfilePic] = useState(null);

  const {employeeDetails, updateEmployeeDetails } = useLocalStorage({navigation});
  const {employeeId} = useAppSelector(state => state.employee);


  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);


  const selectImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        setProfilePic(imageUri);
        updateEmployeeDetails({ProfilePic: imageUri});
      }
    });
  };

  // const deleteImage = () => {
  //   Alert.alert(
  //     'Delete Profile Picture',
  //     'Are you sure you want to delete your profile picture?',
  //     [
  //       {text: 'Cancel', style: 'cancel'},
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           setProfilePic(null);
  //           updateEmployeeDetails({ProfilePic: null});
  //         },
  //       },
  //     ],
  //     {cancelable: false},
  //   );
  // };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          onPress={() => {
            navigation.goBack();
            console.log('Back Arrow Pressed');
          }}
          style={styles.backArrow}
          name="chevron-left-circle"
          size={40}
          color="white"
        />
      </View>

      <LogoutDialog navigation={navigation} visible={dialogVisible} hideDialog={hideDialog} />
      <View style={styles.profileContainer}>
        <View>
          <Image
            source={{
              uri: profilePic
                ? profilePic
                : employeeDetails?.ProfilePic ||
                  'https://avatar.iran.liara.run/public/job/operator/female',
            }}
            style={styles.profilePic}
          />
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={selectImage}>
          <Text style={styles.deleteButtonText}>Edit Profile</Text>
          <MaterialCommunityIcons
            name="account-edit-outline"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        <View style={styles.employeeDetails}>
          <Text style={styles.employeeId}>
            Employee Name: {employeeDetails?.UserName}
          </Text>
          <Text style={styles.employeeId}>
            Employee ID: {employeeId ? employeeId : employeeDetails?.EmployeeId}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={showDialog}>
        <MaterialCommunityIcons
            name="logout"
            size={24}
            color="#000"
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    position: 'relative',
    // alignItems: 'center',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#578FCA',
    width: '100%',
    // height: '35%',
  },
  backArrow: {
    top: 30,
    left: 20,
  },
  profileContainer: {
    position: 'absolute',
    top: '35%',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    // padding: 50,
    // marginBottom: 20,
  },
  profilePic: {
    top: -100,
    width: 200,
    height: 200,
    borderRadius: 105,
    borderWidth: 3,
    borderColor: '#fff',
  },
  deleteButton: {
    marginTop: -20,
    flexDirection: 'row',
    gap: 10,
    // marginVertical: 20,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#ff4444',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  employeeDetails: {
    padding: 20,
    // alignItems: 'center',
    // backgroundColor: 'red',
    marginTop: 20,
  },
  employeeId: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  logoutButton: {
    flexDirection : 'row',

    gap :10,
    width: '50%',
    padding: 10,
    // backgroundColor: '#6200ee',
    borderWidth :  1,
    borderColor : 'lightgrey',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent :'center',
    marginTop: 5,
  },
  logoutButtonText: {
    color: '#000',
    fontWeight: 600,
    fontSize: 16,
  },
});

export default ProfileScreen;
