import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(calendar);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(utc); dayjs.extend(timezone);dayjs.extend(calendar);
const obj = {
  currencyFormat: (number = "") => {
    return new Intl.NumberFormat("en-IN", {}).format(number);
  },
  dateFormat: (date, timeZone) => {
    var convertedDate = new Date(date).toLocaleString(undefined, {
      timeZone: timeZone ? timeZone : "Asia/Kolkata",
    });

    return convertedDate.toString();
  },
  msgDateFormat: (date, timeZone) => {
    var convertedDate = new Date(date).toLocaleDateString(undefined, {
      timeZone: timeZone ? timeZone : "Asia/Kolkata",
    });

    return convertedDate.toString();
  },
//   matchDateTime: (date, timeZone) => {
//     return dayjs(date).calendar(null, {
//       sameDay: 'h:mm A', // The same day ( Today at 2:30 AM )
//       nextDay: '[Tomorrow] h:mm A', // The next day ( Tomorrow at 2:30 AM ) [Tomorrow at] h:mm A
//       nextWeek: 'DD/MM/YYYY h:mm A', // The next week ( Sunday at 2:30 AM )
//       lastDay: '[Yesterday ] h:mm A', // The day before ( Yesterday at 2:30 AM )
//       lastWeek: '[Last] dddd h:mm A', // Last week ( Last Monday at 2:30 AM )
//       sameElse: 'DD/MM/YYYY h:mm A' // Everything else ( 17/10/2011 )
//     })
//   },

  matchDateTime: (date, timeZone) => {
    return dayjs(date)
      .add(2, "hour")
      .add(30, "minute")
      .calendar(null, {
        sameDay: "h:mm A", // Today at 2:30 AM
        nextDay: "[Tomorrow] h:mm A", // Tomorrow at 2:30 AM
        nextWeek: "DD/MM/YYYY h:mm A", // Next week
        lastDay: "[Yesterday] h:mm A", // Yesterday
        lastWeek: "[Last] dddd h:mm A", // Last Monday
        sameElse: "DD/MM/YYYY h:mm A", // Everything else
      });
  },
  marketStatus: (s) => {
    var status = '';
    switch (s) {
      case 1:
        status = 'Open';
        break;
      case 2:
        status = 'In Active';
        break;
      case 3:
        status = 'Suspended';
        break;
      case 4:
        status = 'Closed';
        break;
      case 9:
        status = 'Ball Start';
        break;
      default:
        status = '';
    }
    return status;

  },
  getSportType: (t) => {
    var type = '';
    switch (t) {
      case 1:
        type = 'soccer';
        break;
      case 2:
        type = 'tennis';
        break;
      case 4:
        type = 'cricket';
        break;

      default:
        type = '';
    }
    return type;
  },
  betCheckObj: {
    4: "Cricket",
    2: "Tennis",
    1: "Soccer",
    3: "Casino",
  },
  isInputNumber: (event) => {
    var char = String.fromCharCode(event.which);
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }
  }
}

export default obj;