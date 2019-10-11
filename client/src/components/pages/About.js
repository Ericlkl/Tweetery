import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    height: '100%'
  }
}));

const About = () => {
  const classes = useStyles();

  return (
    <Grid style={{ padding: '2rem' }} container spacing={2}>
      <Grid item xs={12}>
        <Paper className={classes.root}>
          <Typography color='primary' variant='h5' component='h3'>
            About
          </Typography>

          <Typography
            style={{ margin: '1rem 0' }}
            variant='body1'
            component='h3'
          >
            Paragraph about this app
          </Typography>

          <Typography variant='body1' component='h3'>
            Version : 1.0.0
          </Typography>

          <Typography variant='body1' component='h3'>
            Developed By : John Santas / Eric Lee
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default About;
