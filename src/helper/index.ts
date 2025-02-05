// import GetLocation from 'react-native-get-location';
// import {getPreciseDistance} from 'geolib';
interface LocationData {
  locationName: string;
  id: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  range: string;
}

interface TransformedData {
  id: string;
  label: string;
  value: LocationData;
}

function transformDataForDropDown(data: LocationData[]): TransformedData[] {
  if (!Array.isArray(data)) {
    return [
      {
        id: '',
        label: '',
        value: {
          locationName: '',
          id: '',
          coordinates: {
            longitude: 0,
            latitude: 0,
          },
          range: '',
        },
      },
    ];
  }
  return data.map(item => {
    return {
      id: item.locationId,
      label: item.locationName,
      value: item,
    };
  });
}

// function getDistance(coordinate1, coordinate2) {
//   return getPreciseDistance(coordinate1, coordinate2);
// }

// function checkDistanceInRange(distance, range) {
//   const distanceDifference = Math.abs(distance - range);
//   const inRange = distance <= range; // Adding buffer to the range
//   return {
//     inRange: inRange,
//     outBound: inRange ? 0 : distanceDifference,
//   };
// }
function convertTo12HourFormat(time24: string): string {
  const [hours, minutes] = time24.split(':');
  const period = +hours >= 12 ? 'PM' : 'AM';
  const hours12 = +hours % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
}

function formatDate() {
  const date = new Date(); // Current date and time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  const currentDate = `${year}-${month}-${day}`;
  const currentTime24 = `${hours}:${minutes}:${seconds}.${milliseconds}`;
  const currentTime12 = convertTo12HourFormat(`${hours}:${minutes}`);
  // const checkinTime = convertTo12HourFormat(`${hours}:${minutes}`);
  // const checkoutTime = convertTo12HourFormat(`${hours}:${minutes}`);
  return {currentDate, currentTime: currentTime24 , currentTime12};
}

export {
  // transformDataForDropDown,
  //   getDistance,
  //   checkDistanceInRange,
  formatDate,
};
