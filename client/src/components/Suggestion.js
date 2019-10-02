import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

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
      <Typography variant='h5' component='h3'>
        Trend <TrendingUpIcon />
      </Typography>
      <Typography component='p'>
        Paper can be used to build surface or other elements for your
        application.
      </Typography>
    </Paper>
  );
};

export default Chart;
