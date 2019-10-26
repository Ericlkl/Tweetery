import React, { useContext } from 'react';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TweetsContext from '../../../context/Tweets/TweetsContext';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import ShowChartIcon from '@material-ui/icons/ShowChart';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

const StreamControl = () => {
  const classes = useStyles();

  const { switchStreamMode, streamMode } = useContext(TweetsContext);

  if (streamMode) {
    return (
      <Fab
        variant='extended'
        color='secondary'
        aria-label='add'
        className={classes.margin}
        onClick={switchStreamMode}
      >
        <ShowChartIcon className={classes.extendedIcon} />
        Static
      </Fab>
    );
  } else {
    return (
      <Fab
        variant='extended'
        color='primary'
        aria-label='add'
        className={classes.margin}
        onClick={switchStreamMode}
      >
        <LiveTvIcon className={classes.extendedIcon} />
        Stream
      </Fab>
    );
  }
};

export default StreamControl;
