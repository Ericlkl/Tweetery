import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core';

import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TwitterIcon from '@material-ui/icons/Twitter';

import Spinner from '../../layout/Spinner';
import TweetsContext from '../../../context/Tweets/TweetsContext';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    height: '100%'
  }
}));

const Word = ({ text, volume }) => {
  const { addTag } = useContext(TweetsContext);

  return (
    <ListItem style={{ width: '100%' }} onClick={() => addTag(text)} button>
      <ListItemIcon>
        <TwitterIcon edge='start' />
      </ListItemIcon>
      <ListItemText primary={text} />
      <ListItemIcon>
        <ListItemText edge='end' primary={volume} />
      </ListItemIcon>
    </ListItem>
  );
};

const Suggestion = () => {
  const classes = useStyles();
  const { trends, fetchTrendingTags } = useContext(TweetsContext);
  const { values, isloading } = trends;
  // componentDidMount
  useEffect(() => {
    // Not Working Yet, Waiting for server setting up
    fetchTrendingTags();

    // eslint-disable-next-line
  }, []);

  const showTrends = () => {
    if (isloading) {
      return <Spinner />;
    } else if (isloading === false && values.length === 0) {
      return (
        <Grid container justify='center'>
          <Typography variant='subtitle1' gutterBottom>
            No Trends Found
          </Typography>
        </Grid>
      );
    }

    return values.map(tag => (
      <Word text={tag.name} volume={tag.tweet_volume} key={tag.name} />
    ));
  };

  return (
    <Paper className={classes.root}>
      <Typography color='primary' variant='h5' component='h3'>
        Trend <TrendingUpIcon />
      </Typography>

      <List component='nav' aria-label='suggestion keywords'>
        {showTrends()}
      </List>
    </Paper>
  );
};

export default Suggestion;
