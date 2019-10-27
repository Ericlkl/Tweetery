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
            Tweetery aims to provide users with a visual representation of the analysis performed on searched tweets. 
            Utilising the Twitter API for getting tweets into the webserver, cleaning the tweet body and performing 
            emotional analysis with IBM Watson API. The results of the performed analysis are displayed on a graph for the user.
            <br />
            <br />
            Tweetery is hosted on the Amazon Web Services (AWS) cloud provider. Utilising EC2 instances, an auto-scaling 
            group, a launch configuration, and a load balancer. These services help tweetery perform consistently by 
            regularly checking the health of our servers and scaling based on our scaling policy.
            <br />
            <br />
            There are two features in this application: <br />
            <strong>Static</strong> - Shows the emotional analytics of the searched topics.
            <br />
            <strong>Stream</strong> - Analyses the emotions of tweets in real time. (Can use only use one query and one user at a time!)
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
