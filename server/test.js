const { getPassSevenDays } = require('./scripts/date');
const moment = require('moment');
const dates = getPassSevenDays();

console.log(dates);

dates.forEach(day => {
  const JSONkey = moment(day).format('MMMDD');
  console.log(JSONkey);
});
