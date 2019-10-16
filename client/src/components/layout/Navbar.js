import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button
} from '@material-ui/core';
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

const Link = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

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
          Tweetery
        </Typography>

        <div className={classes.navbox}>
          <Button
            color='inherit'
            component={Link}
            to='/'
            className={classes.Button}
          >
            Search
          </Button>
          <Button
            color='inherit'
            component={Link}
            to='/live'
            className={classes.Button}
          >
            Live
          </Button>
          <Button
            color='inherit'
            component={Link}
            to='/about'
            className={classes.Button}
          >
            About
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
