import React, { useContext } from 'react';
import _ from 'lodash';
import { Line } from 'react-chartjs-2';
import { Grid, Typography } from '@material-ui/core';

import TweetsContext from '../../../context/Tweets/TweetsContext';

const line = (name, color, borderColor, value) => ({
  label: name,
  fill: false,
  lineTension: 0.1,
  backgroundColor: color,
  borderColor: borderColor,
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: borderColor,
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: color,
  pointHoverBorderColor: 'rgba(220,220,220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
  data: value
});

const LineChart = () => {
  const { result, chartControl } = useContext(TweetsContext);

  if (_.isEmpty(result)) {
    return (
      <Grid container justify='center'>
        <Typography variant='subtitle1' gutterBottom>
          No Record
        </Typography>
      </Grid>
    );
  }

  // First layer - Looping through all the Tag Names
  // Second layer - Looping through all the date

  // Label for x-axis showing Date
  const xlabels = [];
  // datasets for showing line
  const datasets = [];

  // Extract all Query name and loop through it
  Object.keys(result).forEach(query => {
    const value = [];

    // Extract all Date name and loop through it
    Object.keys(result[query]).forEach(date => {
      xlabels.push(date);
      value.push(result[query][date][chartControl]);
    });

    // data point for the query is generate completed
    // Make it as a line element
    datasets.push(
      line(query, 'rgba(75,192,192,0.4)', 'rgba(75,192,192,1)', value)
    );
  });

  // Line Chart Setting
  const chartData = {
    labels: _.uniq(xlabels),
    datasets
  };

  return <Line data={chartData} />;
};

export default LineChart;
