const moment = require('moment');

const getPassSevenDays = () => {
  const date = [];
  // Six day
  for (let i = 0; i < 7; i++) {
    const day = new Date(Date.now() - 864e5 * i);
    date.push(moment(day).format('YYYY-MM-DD'));
  }

  return date;
};

module.exports = {
  getPassSevenDays
};
