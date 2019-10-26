import React, { useReducer } from 'react';
import {
  ADD_TAG,
  REMOVE_TAG,
  SHOW_MSG_BOX,
  DISMISS_MSG_BOX,
  UPDATE_QUERY,
  FETCH_RESULT,
  FETCHING_RESULT,
  UPDATE_STREAM_DATA,
  FETCH_TRENDING_TAGS,
  SET_CHART_CONTROL,
  SWITCH_STREAM_MODE
} from '../action';

import axios from 'axios';
import _ from 'lodash';
import io from 'socket.io-client';
import TweetsContext from './TweetsContext';
import TweetsReducer from './TweetsReducer';
import uuidv4 from 'uuid/v4';

const initState = {
  trends: {
    values: [],
    isloading: true
  },
  queries: [
    {
      id: uuidv4(),
      value: '',
      removable: false
    }
  ],
  result: {
    values: {},
    isloading: false,
    subscribing: []
  },
  chartControl: 'joy',
  streamMode: false,
  messageBox: {
    type: 'error',
    content: 'Error ...',
    show: false
  }
};

// Socket.io
const stream = io.connect('http://localhost:5000/analysis', { forceNew: true });

// Function That Socket io Server send back
stream.on('serverMsg', data => {
  console.log(data);
});

const TweetsState = props => {
  const [state, dispatch] = useReducer(TweetsReducer, initState);

  const fetchResult = async () => {
    // Checking the first query is not empty
    if (state.queries[0].value.length === 0) {
      return showMsgBox(
        'First query can not be Empty ! Please insert the keyword for first query!',
        'warning'
      );
    }

    try {
      // Displaying Spinner for user
      dispatch({ type: FETCHING_RESULT });

      showMsgBox('Processing result ...', 'info');

      // Map each query value to from an array only contains query keyword
      const queries = state.queries.map(query => query.value);

      // Fetch Result Data from server
      const res = await axios.post('/api/tweets/analyse', { queries });

      // Updata react state when the result came back
      dispatch({
        type: FETCH_RESULT,
        payload: res.data
      });

      showMsgBox('Result Generated Successfully ! ', 'success');
    } catch (error) {
      showMsgBox('Fail to connect Server! Please Try again later ', 'error');
      dispatch({
        type: FETCH_RESULT,
        payload: { values: [], isloading: false }
      });
    }
  };

  // To start streaming data
  const fetchStream = async () => {
    if (state.queries[0].value.length === 0) {
      return showMsgBox(
        'First query can not be Empty ! Please insert the keyword for first query!',
        'warning'
      );
    }

    try {
      // Displaying Spinner for user
      dispatch({ type: FETCHING_RESULT });

      showMsgBox('Processing result ...', 'info');

      // Map each query value to from an array only contains query keyword
      const queries = state.queries.map(query => query.value);

      // Join the channel that constantly receive data about the query
      stream.emit('subscribe', queries);

      stream.on('subscriptionData', res => {
        dispatch({
          type: UPDATE_STREAM_DATA,
          payload: res
        });
      });
    } catch (error) {
      showMsgBox('Fail to connect Server! Please Try again later ', 'error');
      dispatch({
        type: FETCH_RESULT,
        payload: { values: [], isloading: false }
      });
    }
  };

  const unsubscribeStream = () =>
    stream.emit('unsubscribe', state.result.subscribing);

  const fetchTrendingTags = async () => {
    try {
      const res = await axios.get('/api/tweets/trends');
      const values = _.remove(res.data, tweet => tweet.tweet_volume > 0).slice(
        0,
        15
      );

      dispatch({
        type: FETCH_TRENDING_TAGS,
        payload: {
          values,
          isloading: false
        }
      });
    } catch (error) {
      showMsgBox('Fail to connect Server! Please Try again later ', 'error');

      dispatch({
        type: FETCH_TRENDING_TAGS,
        payload: { values: [], isloading: false }
      });
    }
  };

  // Updating the query
  // Such as inserting the value in the SearchField
  const updateQuery = (id, value) =>
    dispatch({ type: UPDATE_QUERY, payload: { id, value } });

  // Remove Tag in the query
  const addTag = (value = '') => {
    if (state.queries.length === 5) {
      return showMsgBox(
        'The number of quries can not more than 5! Please remove unnessary query and try again !',
        'error'
      );
    }
    dispatch({ type: ADD_TAG, payload: value });
  };

  // Remove Tag in the query
  const removeTag = id => dispatch({ type: REMOVE_TAG, payload: id });

  const setChartControl = controlValue =>
    dispatch({ type: SET_CHART_CONTROL, payload: controlValue });

  const switchStreamMode = () => {
    // Ubsubscribe the stream when user switch the query mode
    unsubscribeStream();

    dispatch({ type: SWITCH_STREAM_MODE, payload: !state.streamMode });
    if (!state.streamMode) {
      showMsgBox('Live Stream mode on!', 'success');
    } else {
      showMsgBox('Live Stream mode off!', 'success');
    }
  };

  // --------------------- Internal Actions -------------------------------
  const showMsgBox = (content, type) => {
    dispatch({ type: SHOW_MSG_BOX, payload: { content, type, show: true } });
  };

  const dismissMsgBox = () => dispatch({ type: DISMISS_MSG_BOX });

  return (
    <TweetsContext.Provider
      value={{
        trends: state.trends,
        queries: state.queries,
        result: state.result,
        chartControl: state.chartControl,
        messageBox: state.messageBox,
        streamMode: state.streamMode,
        addTag,
        removeTag,
        fetchResult,
        fetchStream,
        updateQuery,
        setChartControl,
        switchStreamMode,
        fetchTrendingTags,
        dismissMsgBox,
        unsubscribeStream
      }}
    >
      {props.children}
    </TweetsContext.Provider>
  );
};

export default TweetsState;
