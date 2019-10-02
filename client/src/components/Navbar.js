import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  Button: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  navbox: {
    display: 'flex'
  }
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton
          edge='start'
          className={classes.Button}
          color='inherit'
          aria-label='menu'
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' className={classes.title}>
          EmoTweets
        </Typography>

        <div className={classes.navbox}>
          <Typography className={classes.Button} variant='h6'>
            Search
          </Typography>
          <Typography className={classes.Button} variant='h6'>
            About
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
