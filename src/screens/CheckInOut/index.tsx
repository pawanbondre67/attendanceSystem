import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import {Button} from 'react-native-paper';
import useCheckInOut from './useCheckInOut';
import CaptureImage from './component/CaptureImage';

type Props = {};
const CheckInOut = (props: Props) => {
  const {
    checkInOutData,
    onSubmit,
    errorState,
    btnLabel,
    isFetchingLocation,
    markAttendanceResult,
    proceedMarkAttendance,
    onPhotoCapture,
    currentLatitude,
    pickImage,
    currentLongitude,
  } = useCheckInOut();

  return checkInOutData.showCamera ? (
    <CaptureImage onPhotoCapture={onPhotoCapture} />
  ) : (
    <View style={styles.container}>


      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imagebody} onPress={pickImage}>
          {checkInOutData.image ? (
            <Image
              source={{uri: 'file://' + checkInOutData.image}}
              style={styles.image}
            />
          ) : (
            <Text style={styles.placeholderText}>Tap to capture selfie</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.note}>Make sure to upload a clear face selfie</Text>
      </View>

      <View style={styles.button}>
      <Button
        mode="contained"
        onPress={onSubmit}
        style={styles.button}>
        Mark Attendance
      </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    flexDirection: 'column',

    alignItems: 'center',
    gap: 20,
  },
  imageContainer: {
    marginTop: '30%',
    paddingVertical: '20%',
    width: '100%',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  imagebody: {
    width:180,
    height: 180,
    backgroundColor: '#e0e0e0',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  placeholderText: {
    color: '#757575',
    textAlign: 'center',
  },
  note: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: '100%',
    padding: 10,
  },
});
export default CheckInOut;
