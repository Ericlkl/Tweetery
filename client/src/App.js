import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Navbar from './components/Navbar';
import Chart from './components/Chart';
import Suggestion from './components/Suggestion';
import Search from './components/Search';

const useStyles = makeStyles(theme => ({
  content: {
    padding: '2rem'
  }
}));

const App = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <Navbar />

      <Grid className={classes.content} container spacing={2}>
        <Grid item xs={12} md={8}>
          <Chart />
        </Grid>
        <Grid item xs={12} md={4}>
          <Suggestion />
        </Grid>
      </Grid>

      <Grid className={classes.content} container spacing={2}>
        <Grid item xs={12} md={12}>
          <Search />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;
