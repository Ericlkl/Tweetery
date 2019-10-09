import React from 'react';
import LineChart from './LineChart';
import ChartControl from './ChartControl';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    height: '100%'
  }
}));

const Result = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      {/* Section title */}
      <Typography color='primary' variant='h5' component='h3'>
        Result
      </Typography>
      {/* Section Content */}

      <LineChart />
      <ChartControl />
    </Paper>
  );
};

export default Result;
