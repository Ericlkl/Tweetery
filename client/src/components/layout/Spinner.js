import React from 'react';
import { Grid } from '@material-ui/core';

import CircularProgress from '@material-ui/core/CircularProgress';

const Spinner = () => {
  return (
    <Grid container justify='center'>
      <CircularProgress />
    </Grid>
  );
};

export default Spinner;
