import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import Chart from './Chart';
import Suggestion from './Suggestion';
import Search from './Search';

const Home = () => {
  return (
    <Fragment>
      <Grid style={{ padding: '2rem' }} container spacing={2}>
        <Grid item xs={12} md={8}>
          <Chart />
        </Grid>
        <Grid item xs={12} md={4}>
          <Suggestion />
        </Grid>
      </Grid>

      <Grid style={{ padding: '2rem' }} container spacing={2}>
        <Grid item xs={12} md={12}>
          <Search />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Home;
