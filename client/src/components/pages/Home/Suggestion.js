import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core';

import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TwitterIcon from '@material-ui/icons/Twitter';

import TweetsContext from '../../../context/Tweets/TweetsContext';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    height: '100%'
  }
}));

const Word = ({ text }) => {
  return (
    <ListItem button>
      <ListItemIcon>
        <TwitterIcon edge='start' />
      </ListItemIcon>
      <ListItemText primary={`#${text}`} />
    </ListItem>
  );
};

const Suggestion = () => {
  const classes = useStyles();
  const { trends, fetchTrendingTags } = useContext(TweetsContext);

  return (
    <Paper className={classes.root}>
      <Typography color='primary' variant='h5' component='h3'>
        Trend <TrendingUpIcon />
      </Typography>

      <List component='nav' aria-label='suggestion keywords'>
        {trends.map(tagName => (
          <Word text={tagName} key={tagName} />
        ))}
      </List>
    </Paper>
  );
};

export default Suggestion;
