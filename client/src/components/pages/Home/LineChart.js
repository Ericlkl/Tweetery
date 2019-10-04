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

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    line('First Line', 'rgba(75,192,192,0.4)', 'rgba(75,192,192,1)', [
      65,
      59,
      80,
      81,
      56,
      55,
      40
    ]),

    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [80, 100, 90, 21, 59, 77, 40]
    }
  ]
};

const LineChart = () => {
  return <Line data={data} />;
};

export default LineChart;
