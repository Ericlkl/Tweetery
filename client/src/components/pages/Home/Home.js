import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import Result from './Result';
import Suggestion from './Suggestion';
import Search from './Search';
import MessageBox from '../../layout/MessageBox';

const Home = () => {
  return (
    <Fragment>
      {/* First Row */}
      <Grid style={{ padding: '2rem' }} container spacing={2}>
        {/* Display D3 Chart for visualizing Emotion related to hash tag */}
        <Grid item xs={12} md={8}>
          <Result />
        </Grid>
        {/* Showing Trending Tags for uses  */}
        <Grid item xs={12} md={4}>
          <Suggestion />
        </Grid>
      </Grid>

      <Grid style={{ padding: '2rem' }} container spacing={2}>
        {/* Manually searching field */}
        <Grid item xs={12} md={12}>
          <Search />
        </Grid>
      </Grid>
      <MessageBox />
    </Fragment>
  );
};

export default Home;
