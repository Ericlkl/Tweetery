import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';

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

const LineChart = ({ data }) => {
  // First layer - Looping through all the Tag Names
  // Second layer - Looping through all the date

  const xlabels = [];

  const result = [];

  // Query is String
  Object.keys(data).forEach(query => {
    const value = [];

    // Date is String
    Object.keys(data[query]).forEach(date => {
      xlabels.push(date);
      value.push(data[query][date]['joy']);
    });

    result.push(
      line(query, 'rgba(75,192,192,0.4)', 'rgba(75,192,192,1)', value)
    );
  });

  console.log(xlabels);
  console.log(result);

  // Line Chart Setting
  const chartData = {
    labels: xlabels,
    datasets: result
  };

  return <Line data={chartData} />;
};

export default LineChart;
