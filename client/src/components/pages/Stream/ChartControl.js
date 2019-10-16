import React, { useContext } from 'react';
import { Grid, Button, ButtonGroup } from '@material-ui/core';
import TweetsContext from '../../../context/Tweets/TweetsContext';

const ChartControl = () => {
  const { chartControl, setChartControl } = useContext(TweetsContext);
  return (
    <Grid
      style={{
        padding: '1rem 2rem',
        marginTop: 'auto'
      }}
      container
      item
      xs={12}
      justify='center'
    >
      <ButtonGroup fullWidth aria-label='full width outlined button group'>
        <Button
          onClick={() => setChartControl('joy')}
          disabled={chartControl === 'joy'}
        >
          Joyful
        </Button>
        <Button
          onClick={() => setChartControl('sadness')}
          disabled={chartControl === 'sadness'}
        >
          Sadness
        </Button>
        <Button
          onClick={() => setChartControl('fear')}
          disabled={chartControl === 'fear'}
        >
          Fear
        </Button>
        <Button
          onClick={() => setChartControl('disgust')}
          disabled={chartControl === 'disgust'}
        >
          Disgust
        </Button>
        <Button
          onClick={() => setChartControl('anger')}
          disabled={chartControl === 'anger'}
        >
          Anger
        </Button>
      </ButtonGroup>
    </Grid>
  );
};

export default ChartControl;
