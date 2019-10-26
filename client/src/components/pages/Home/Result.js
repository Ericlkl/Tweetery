import React from 'react';
import LineChart from './LineChart';
import ChartControl from './ChartControl';
import StreamControl from './StreamControl';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid } from '@material-ui/core';

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
      <Grid container justify='space-between' alignItems='center'>
        <Grid item xs={2}>
          <Typography color='primary' variant='h5' component='h3'>
            Result
          </Typography>
        </Grid>

        <Grid item xs={4} sm={3} lg={2}>
          <StreamControl />
        </Grid>
      </Grid>

      {/* Section Content */}

      <LineChart />
      <ChartControl />
    </Paper>
  );
};

export default Result;
