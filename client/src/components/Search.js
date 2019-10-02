import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));

const Search = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Typography variant='h5' component='h3'>
        Search
      </Typography>
      <Typography component='p'>
        Paper can be used to build surface or other elements for your
        application.
      </Typography>
    </Paper>
  );
};

export default Search;
