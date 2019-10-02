import React from 'react';
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

  return (
    <Paper className={classes.root}>
      <Typography color='primary' variant='h5' component='h3'>
        Trend <TrendingUpIcon />
      </Typography>

      <List component='nav' aria-label='suggestion keywords'>
        <Word text='Trump' />
        <Word text='Pikachu' />
        <Word text='Star War' />
      </List>
    </Paper>
  );
};

export default Suggestion;
