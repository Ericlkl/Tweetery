import React, { useContext } from 'react';
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

import TweetsContext from '../../../context/Tweets/TweetsContext';

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

const SearchField = ({ tag }) => {
  const { id, value, removable } = tag;
  const { updateQuery, removeTag } = useContext(TweetsContext);

  const onInputChange = e => {
    updateQuery(id, e.target.value);
  };

  return (
    <Grid
      container
      spacing={2}
      justify='flex-start'
      alignItems='center'
      style={{
        margin: '2rem 0'
      }}
    >
      <Grid item xs={10} sm={11}>
        <TextField
          variant='outlined'
          label='Tag'
          value={value}
          onChange={onInputChange}
          style={{
            width: '100%'
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>#</InputAdornment>
          }}
        />
      </Grid>
      {removable === true ? (
        <Grid item xs={2} sm={1}>
          <Fab size='small' onClick={() => removeTag(id)}>
            <ClearIcon />
          </Fab>
        </Grid>
      ) : null}
    </Grid>
  );
};

const SearchBtn = ({ addTag }) => {
  return (
    <Grid container spacing={2} justify='center'>
      <Grid item>
        <Fab
          onClick={() => {
            addTag();
          }}
          variant='extended'
          size='medium'
          aria-label='search'
        >
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

const Search = props => {
  const classes = useStyles();

  const { queries, addTag } = useContext(TweetsContext);

  return (
    <Paper className={classes.root}>
      <Typography color='primary' variant='h5' component='h3'>
        Search
      </Typography>

      {queries.map(tag => (
        <SearchField tag={tag} key={tag.id} />
      ))}
      <SearchBtn addTag={addTag} />
    </Paper>
  );
};

export default Search;
