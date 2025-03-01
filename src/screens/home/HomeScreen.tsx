// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {useAppSelector} from '../../redux/hook/hook';

// import Clock from '../../components/Clock';

// import useLocalStorage from './useLocalStorage';

// import LogoutDialog from '../../components/Dialog';
// import {isIos} from '../../helper/utility';
// import { useLatestStatusQuery } from '../../redux/services/attendance/attendanceApiSlice';
// import { useLazyLoginQuery } from '../../redux/services/auth/login/LoginApiSlice';
// import useHistoryData from './useHistoryData';
// const HomeScreen = ({navigation}: any) => {

//   const {inTime , outTime , refetch} = useHistoryData();

//   const {employeeId} = useAppSelector(state => state.employee);

//   const {employeeDetails } = useLocalStorage({
//     navigation,
//   });

//   const {status} = useAppSelector(
//     state => state.attendance.CheckInOutData,
//   );
//   const {employeeDetailsState} = useAppSelector(state => state.employee);
// // Fetch latest status
// const { error : latestStatusDataError} = useLatestStatusQuery({
//   CustomerCode: employeeDetailsState?.CustomerCode || '',
// });
// const [loginUser] = useLazyLoginQuery();

// useEffect(() => {
//   if(latestStatusDataError){
//     console.log('error', latestStatusDataError);
//     loginUser(employeeDetailsState, false);
//   }
// }, [latestStatusDataError]);

// // Refetch history data when the component mounts
// useEffect(() => {
//   refetch();
// }, [refetch]);

//   console.log('status', status);

//   const [dialogVisible, setDialogVisible] = useState(false);

//   const showDialog = () => setDialogVisible(true);
//   const hideDialog = () => setDialogVisible(false);
//   const insets = useSafeAreaInsets();

//   return (
//     <View
//       style={[
//         styles.maincontainer,
//         {paddingTop: insets.top, paddingBottom: insets.bottom},
//       ]}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <View style={styles.userInfo}>
//           <TouchableWithoutFeedback
//             onPress={() => navigation.navigate('profileTab')}>
//             <Image
//               style={styles.userImage}
//               source={{
//                 uri: employeeDetails?.ProfilePic
//                   ? employeeDetails?.ProfilePic
//                   : 'https://avatar.iran.liara.run/public/boy?username=pawan',
//               }} // Placeholder image
//             />
//           </TouchableWithoutFeedback>
//           <View>
//             <Text style={styles.userName}>
//               <Text style={{fontWeight: 300}}>welcome,</Text>{' '}
//               {employeeDetails?.UserName}
//             </Text>
//             <Text style={styles.userId}>{employeeId}</Text>
//           </View>
//         </View>
//         <Icon name="logout" onPress={showDialog} size={24} color="#fff" />
//       </View>

//       <View style={styles.container}>
//         <LogoutDialog
//           navigation={navigation}
//           visible={dialogVisible}
//           hideDialog={hideDialog}
//         />

//         <Clock />

//         {/* Punch In Button */}
//         <View style={styles.btncontainer}>
//           {status === 'in' ? (
//             <View style={styles.outerCircle}>
//               <TouchableOpacity
//                 style={styles.button}
//                 onPress={() =>
//                   navigation.navigate('checkinout', {type: 'checkout'})
//                 }>
//                 <View style={styles.innerCircle}>
//                   <Icon name="touch-app" size={40} color="green" />
//                   <Text style={styles.label}>Check Out</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.outerCircle}>
//               <TouchableOpacity
//                 style={styles.button}
//                 onPress={() =>
//                   navigation.navigate('checkinout', {type: 'checkin'})
//                 }>
//                 <View style={styles.innerCircle}>
//                   <Icon name="touch-app" size={40} color="red" />
//                   <Text style={styles.label}>Check In</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//         {/* Punch Details Section */}

//         <View style={styles.punchDetails}>
//           <View style={styles.punchItem}>
//             <Icon name="access-time" size={24} color="#ff0000" />
//             <Text style={styles.punchText}>
//               {inTime || '00:00'}
//             </Text>
//             <Text style={styles.punchLabel}>Check In</Text>
//           </View>
//           <View style={styles.punchItem}>
//             <Icon name="access-time" size={24} color="#ff0000" />
//             <Text style={styles.punchText}>
//               {outTime  || '00:00'}
//             </Text>
//             <Text style={styles.punchLabel}>Check Out</Text>
//           </View>
//           <View style={styles.punchItem}>
//             <Icon name="timer" size={24} color="#ff0000" />
//             <Text style={styles.punchText}>00:00</Text>
//             <Text style={styles.punchLabel}>Total Hours</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   maincontainer: {
//     flex: 1,
//     backgroundColor: isIos ? '#578FCA' : '',
//   },
//   container: {
//     height: '100%',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#f7f7f7',
//   },
//   btncontainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   location: {
//     flexDirection: 'column',
//     gap: 10,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: isIos ? 0 : 10,
//     paddingVertical: 10,
//     backgroundColor: '#578FCA',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   userName: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#fff',
//   },
//   userId: {
//     color: '#fff',
//   },
//   loaderText: {
//     marginTop: 10,
//     fontSize: 16,
//   },
//   outerCircle: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 180,
//     height: 180,
//     borderRadius: 90, // Should be half of width/height to maintain circle
//     borderWidth: 1,
//     borderColor: 'lightgrey',
//     backgroundColor: 'lightgrey',
//     // shadowColor: 'green',
//     // shadowOffset: {width: 0, height: 4}, // Reduced height for a more subtle shadow
//     // shadowOpacity: 0.1,
//     // shadowRadius: 8,
//     // elevation: 2, // Lowered elevation for less aggressive shadow
//   },
//   button: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 155,
//     height: 155,
//     borderRadius: 77.5, // Should be half of width/height to maintain circle
//     backgroundColor: '#fff',
//     // elevation: 5, // Keeping consistent with outer circle elevation
//   },
//   innerCircle: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 140,
//     height: 140,
//     borderRadius: 90,
//     backgroundColor: '#f7f7f7',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2}, // Softer shadow offset
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     // elevation: 3,
//   },
//   label: {
//     marginTop: 8,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   punchDetails: {
//     flexDirection: 'row',
//     width: '100%',
//     justifyContent: 'space-around',
//     paddingVertical: 20,
//     backgroundColor: '#fff',
//     marginBottom: isIos ? 20 : 70,
//     // borderTopWidth: 1,
//     // borderBottomWidth: 1,
//     // borderColor: '#ddd',
//   },
//   punchItem: {
//     alignItems: 'center',
//   },
//   punchText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   punchLabel: {
//     fontSize: 12,
//     color: '#888',
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 15,
//     backgroundColor: '#e53935',
//   },
//   navItem: {
//     alignItems: 'center',
//   },
//   navText: {
//     color: '#fff',
//     marginTop: 5,
//     fontSize: 12,
//   },
// });

// export default HomeScreen;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from '../../redux/hook/hook';
import Clock from '../../components/Clock';
import useLocalStorage from './useLocalStorage';
import LogoutDialog from '../../components/Dialog';
import {isIos} from '../../helper/utility';
import {useLatestStatusQuery} from '../../redux/services/attendance/attendanceApiSlice';
import {useLazyLoginQuery} from '../../redux/services/auth/login/LoginApiSlice';
import useHistoryData from './useHistoryData';

const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation}: any) => {
  const {inTime, outTime, refetch} = useHistoryData();
  const {employeeDetails} = useLocalStorage({navigation});
  const {status} = useAppSelector(state => state.attendance.CheckInOutData);
  const {employeeDetailsState} = useAppSelector(state => state.employee);

  // Fetch latest status
  const {error: latestStatusDataError} = useLatestStatusQuery({
    CustomerCode: employeeDetailsState?.CustomerCode || '',
  });
  const [loginUser] = useLazyLoginQuery();

  useEffect(() => {
    if (latestStatusDataError) {
      console.log('error', latestStatusDataError);
      loginUser(employeeDetailsState, false);
    }
  }, [latestStatusDataError]);

  // Refetch history data when the component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={[
          styles.header,
          {paddingTop: insets.top},
        ]}>
        <View style={styles.userInfo}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('profileTab')}>
            <Image
              style={styles.userImage}
              source={{
                uri: employeeDetails?.ProfilePic
                  ? employeeDetails?.ProfilePic
                  : 'https://avatar.iran.liara.run/public/boy?username=pawan',
              }}
            />
          </TouchableWithoutFeedback>
          <View>
            <Text style={styles.userName}>
              <Text style={{fontWeight: '300'}}>Good Morning, </Text>
            </Text>
            <Text style={styles.userId}> {employeeDetails?.UserName}</Text>
          </View>
        </View>
        <Icon name="logout" onPress={showDialog} size={24} color="#fff" />
      </View>

      <ScrollView
        style={[styles.maincontainer]}
        contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}

        <View style={styles.container}>
          <LogoutDialog
            navigation={navigation}
            visible={dialogVisible}
            hideDialog={hideDialog}
          />
          <Clock />

          {/* Punch In Button */}
          <View style={styles.btncontainer}>
            {status === 'in' ? (
              <View style={styles.outerCircle}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate('checkinout', {type: 'checkout'})
                  }>
                  <View style={styles.innerCircle}>
                    <Icon name="touch-app" size={40} color="green" />
                    <Text style={styles.label}>Check Out</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.outerCircle}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate('checkinout', {type: 'checkin'})
                  }>
                  <View style={styles.innerCircle}>
                    <Icon name="touch-app" size={40} color="red" />
                    <Text style={styles.label}>Check In</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Punch Details Section */}
          <View style={styles.punchDetails}>
            <View style={styles.punchItem}>
              <Icon name="access-time" size={24} color="#ff0000" />
              <Text style={styles.punchText}>{inTime || '00:00'}</Text>
              <Text style={styles.punchLabel}>Check In</Text>
            </View>
            <View style={styles.punchItem}>
              <Icon name="access-time" size={24} color="#ff0000" />
              <Text style={styles.punchText}>{outTime || '00:00'}</Text>
              <Text style={styles.punchLabel}>Check Out</Text>
            </View>
            <View style={styles.punchItem}>
              <Icon name="timer" size={24} color="#ff0000" />
              <Text style={styles.punchText}>00:00</Text>
              <Text style={styles.punchLabel}>Total Hours</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: isIos ? '#f7f7f7' : '',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  btncontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    backgroundColor: '#578FCA',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
    color: '#fff',
  },
  userId: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.225,
    borderWidth: 1,
    borderColor: 'lightgrey',
    backgroundColor: 'lightgrey',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: '#fff',
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.175,
    backgroundColor: '#f7f7f7',
  },
  label: {
    marginTop: height * 0.01,
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
  },
  punchDetails: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
    // marginBottom: Platform.OS === 'ios' ? -height * 0.04 : height * 0.07,
  },
  punchItem: {
    alignItems: 'center',
  },
  punchText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginTop: height * 0.005,
  },
  punchLabel: {
    fontSize: width * 0.03,
    color: '#888',
  },
});

export default HomeScreen;
