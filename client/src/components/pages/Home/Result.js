import React, { useContext } from 'react';
import LineChart from './LineChart';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography,
  Grid,
  Button,
  ButtonGroup
} from '@material-ui/core';
import TweetsContext from '../../../context/Tweets/TweetsContext';

import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    height: '100%'
  }
}));

const Result = () => {
  const classes = useStyles();
  const { result } = useContext(TweetsContext);

  return (
    <Paper className={classes.root}>
      {/* Section title */}
      <Typography color='primary' variant='h5' component='h3'>
        Result
      </Typography>
      {/* Section Content */}
      {result !== null ? <LineChart emotionData={result} /> : null}

      <Grid
        style={{
          padding: '1rem 2rem'
        }}
        item
        xs={12}
        justify='center'
      >
        <ButtonGroup fullWidth aria-label='full width outlined button group'>
          <Button>Joyful</Button>
          <Button>Sadness</Button>
          <Button>Fear</Button>
          <Button>Disgust</Button>
          <Button>Anger</Button>
        </ButtonGroup>
      </Grid>
    </Paper>
  );
};

export default Result;
