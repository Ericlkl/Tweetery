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

const LineChart = ({ emotionData }) => {
  const firstElementName = Object.keys(emotionData)[0];
  const xlabels = Object.keys(emotionData[firstElementName]);
  // First layer - Looping through all the Tag Names
  // Second layer - Looping through all the date

  const joy = [];

  Object.keys(emotionData).forEach(name =>
    Object.keys(emotionData[name]).forEach(date =>
      joy.push(emotionData[name][date]['joy'])
    )
  );

  console.log(joy);

  // Line Chart Setting
  const data = {
    labels: xlabels,
    datasets: [
      line(firstElementName, 'rgba(75,192,192,0.4)', 'rgba(75,192,192,1)', joy)
    ]
  };

  return <Line data={data} />;
};

export default LineChart;
