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
function formatDate(date : any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export {
  // transformDataForDropDown,
//   getDistance,
//   checkDistanceInRange,
  formatDate,
};
