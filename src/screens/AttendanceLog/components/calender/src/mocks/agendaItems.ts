import isEmpty from 'lodash/isEmpty';
import {MarkedDates} from '../../../src/types';

// const today = new Date().toISOString().split('T')[0];
// const fastDate = getPastDate(3);
// const futureDates = getFutureDates(12);
// const dates = [fastDate, today].concat(futureDates);

// function getFutureDates(numberOfDays: number) {
//   const array: string[] = [];
//   for (let index = 1; index <= numberOfDays; index++) {
//     let d = Date.now();
//     if (index > 8) {
//       // set dates on the next month
//       const newMonth = new Date(d).getMonth() + 1;
//       d = new Date(d).setMonth(newMonth);
//     }
//     const date = new Date(d + 864e5 * index); // 864e5 == 86400000 == 24*60*60*1000
//     const dateString = date.toISOString().split('T')[0];
//     array.push(dateString);
//   }
//   return array;
// }
// function getPastDate(numberOfDays: number) {
//   return new Date(Date.now() - 864e5 * numberOfDays).toISOString().split('T')[0];
// }

export const agendaItems = [
  {
    title: '2025-02-18',
    data: [
      {
       inTime: '09:00',
        outTime: '18:00',
      },
      {
        inTime: '02:00',
        outTime: '03:00',
      },
    ],
  },
  {
    title: '2025-02-19',
    data: [
      {
        inTime: null,
        outTime: null,
      },
    ],
  },
  {
    title: '2025-02-20',
    data: [
      {
        inTime: '09:00',
        outTime: '18:00',
      },
    ],
  },
  {
    title: '2025-02-21',
    data: [
      {
        inTime: '09:00',
        outTime: '18:00',
      },
    ],
  },
  {
    title: '2025-02-22',
    data: [
      {
        inTime: '09:00',
        outTime: '18:00',
      },
    ],
  },
  {
    title: '2025-02-23',
    data: [
      {
        inTime: '09:00',
        outTime: '18:00',
      },
    ],
  },
  {
    title: '2025-02-24',
    data: [
      {
        inTime: '09:00',
        outTime: '18:00',
      },
    ],
  },
  {
    title: '2025-02-25',
    data: [
      {
        inTime: '09:00',
        outTime: '18:00',
      },
    ],
  },
  {
    title: '2025-02-26',
    data: [
      {
        inTime: '09:00',
        outTime: '18:00',
      },
    ],
  },
  {
    title: '2025-02-27',
    data: [
      {
        inTime: '09:00',
        outTime: '18:00',
      },
    ],
  },

];


export function getMarkedDates() {
  const marked: MarkedDates = {};

  agendaItems.forEach(item => {
    // NOTE: only mark dates with data
    if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
      marked[item.title] = {marked: true};
    } else {
      marked[item.title] = {disabled: true};
    }
  });
  return marked;
}
