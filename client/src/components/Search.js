import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Grid
} from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  },
  margin: {
    margin: theme.spacing(1)
  },
  textField: {
    flexBasis: 200
  }
}));

const SearchField = () => {
  return (
    <Grid
      container
      spacing={2}
      justify='center'
      alignItems='center'
      style={{
        margin: '1.2rem 0'
      }}
    >
      <Grid item xs={11}>
        <TextField
          id='outlined-adornment-amount'
          variant='outlined'
          label='Tag1'
          value={12}
          style={{
            width: '100%'
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>#</InputAdornment>
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <ClearIcon />
      </Grid>
    </Grid>
  );
};

const Search = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Typography variant='h5' component='h3'>
        Search
      </Typography>

      <SearchField />
    </Paper>
  );
};

export default Search;
