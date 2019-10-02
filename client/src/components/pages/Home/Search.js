import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Fab
} from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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

const SearchBtn = () => {
  return (
    <Grid container spacing={2} justify='center'>
      <Grid item>
        <Fab variant='extended' size='medium' aria-label='search'>
          <AddCircleOutlineIcon style={{ marginRight: '0.5rem' }} />
          Add Query
        </Fab>
      </Grid>
      <Grid item>
        <Fab
          color='primary'
          variant='extended'
          size='medium'
          aria-label='search'
        >
          <SearchIcon style={{ marginRight: '0.5rem' }} />
          Search
        </Fab>
      </Grid>
    </Grid>
  );
};

const Search = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography color='primary' variant='h5' component='h3'>
        Search
      </Typography>

      <SearchField />
      <SearchBtn />
    </Paper>
  );
};

export default Search;