import React, { useState } from 'react';
import LineChart from './LineChart';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    height: '100%'
  }
}));

const Chart = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      {/* Section title */}
      <Typography color='primary' variant='h5' component='h3'>
        Result
        <LineChart />
      </Typography>
      {/* Section Content */}
    </Paper>
  );
};

export default Chart;
