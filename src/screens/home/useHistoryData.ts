import {useEffect, useMemo, useState} from 'react';
import {useAppSelector} from '../../redux/hook/hook';
import {useHistoryOfAttendanceQuery} from '../../redux/services/attendance/attendanceApiSlice';
import {set} from 'lodash';

const useHistoryData = () => {
  const {employeeDetailsState, employeeId} = useAppSelector(
    state => state.employee,
  );

  const today = new Date().toISOString().split('T')[0];

  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');

  const {data, refetch} = useHistoryOfAttendanceQuery({
    fromdate: today,
    todate: today,
    id: employeeId,
    CustomerCode: employeeDetailsState?.CustomerCode || '',
  });

  const [items, setItems] = useState<any[]>([]);

  const formatServerData = data => {
    const formattedData: any[] = [];

    // Reverse the data array
    const reversedData = [...data].reverse();

    reversedData.forEach((entry: {inDate: any; inTime: any; outTime: any}) => {
      const {inDate, inTime, outTime} = entry;

      // Find or create the day entry in the formattedData array
      let dayEntry = formattedData.find(item => item.title === inDate);
      if (!dayEntry) {
        dayEntry = {
          title: inDate,
          data: [],
        };
        formattedData.push(dayEntry);
      }

      // Add the inTime and outTime to the day's data
      dayEntry.data.push({
        inTime: inTime ? formatTime(inTime) : null,
        outTime: outTime ? formatTime(outTime) : null,
      });
    });

    return formattedData;
  };

  const formatTime = (timestamp: string): string | null => {
    if (!timestamp) {
      return null;
    }

    const [hours, minutes] = timestamp.split('.')[0].slice(0, 5).split(':');
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    return `${hour}:${minutes} ${period}`;
  };

  const formattedData = useMemo(() => {
    if (data && Array.isArray(data.data)) {
      return formatServerData(data.data);
    }
    return [];
  }, [data]);

  useEffect(() => {
    if (formattedData.length > 0) {
      setItems(formattedData.reverse());
    }
  }, [formattedData]);

  useEffect(() => {
    if (items.length > 0 && items[0]?.data?.length > 0) {
      let len = items[0].data.length;
      const {inTime : CurrentInTime, outTime : CurrentOutTime} = items[0].data[0];
      const {inTime : FirstInTime} = items[0].data[len - 1];
      setInTime(CurrentInTime);
      setOutTime(CurrentOutTime);
      if (CurrentOutTime === null && items[0].data.length > 1) {
        const {outTime: nextOutTime} = items[0].data[1];
        setOutTime(nextOutTime);
      }

      console.log('inTime from home history', inTime);
      console.log('outTime from home history', outTime);
    }
  }, [items]);

  return {
    items,
    inTime,
    outTime,
    refetch,
  };
};

export default useHistoryData;
