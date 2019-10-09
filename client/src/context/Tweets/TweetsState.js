import React, { useReducer } from 'react';
import {
  ADD_TAG,
  REMOVE_TAG,
  SHOW_MSG_BOX,
  DISMISS_MSG_BOX,
  UPDATE_QUERY,
  FETCH_RESULT,
  FETCHING_RESULT,
  FETCH_TRENDING_TAGS,
  SET_CHART_CONTROL
} from '../action';

import axios from 'axios';
import _ from 'lodash';
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
    values: [],
    isloading: false
  },
  chartControl: 'joy',
  messageBox: {
    type: 'error',
    content: 'Error ...',
    show: false
  }
};

const TweetsState = props => {
  const [state, dispatch] = useReducer(TweetsReducer, initState);

  const fetchResult = async () => {
    const firstQuery = state.queries[0].value;

    if (firstQuery.length === 0) {
      return showMsgBox(
        'Tag name can not be Empty ! Please insert the query name and try again !',
        'warning'
      );
    }

    try {
      // Displaying Spinner for user
      dispatch({ type: FETCHING_RESULT });

      showMsgBox('Processing result ...', 'info');

      // Fetch Result Data from server
      const res = await axios.post('/api/tweets/analyse', {
        query: firstQuery
      });

      const values = {};

      /*  Convert Query data format
        {
          Pikachu : {
            Oct02 : { sadness: 0.2232 },
            Oct03 : {}
          }
        }
      */

      res.data.forEach(record => {
        const { date, query, emotions } = record;
        values[query] = {
          ...values[query],
          [date]: { ...emotions }
        };
      });

      dispatch({
        type: FETCH_RESULT,
        payload: {
          values,
          isloading: false
        }
      });

      showMsgBox('Result Generated Successfully ! ', 'success');
    } catch (error) {
      showMsgBox('Fail to connect Server! Please Try again later ', 'error');
    }
  };

  const fetchTrendingTags = async () => {
    try {
      const res = await axios.get('/api/tweets/trends');
      const values = _.remove(res.data, tweet => tweet.tweet_volume > 0).slice(
        0,
        10
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
        payload: []
      });
    }
  };

  // Updating the query
  // Such as inserting the value in the SearchField
  const updateQuery = (id, value) =>
    dispatch({ type: UPDATE_QUERY, payload: { id, value } });

  // Remove Tag in the query
  const addTag = (value = '') => dispatch({ type: ADD_TAG, payload: value });

  // Remove Tag in the query
  const removeTag = id => dispatch({ type: REMOVE_TAG, payload: id });

  const setChartControl = controlValue =>
    dispatch({ type: SET_CHART_CONTROL, payload: controlValue });

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
        addTag,
        removeTag,
        fetchResult,
        updateQuery,
        setChartControl,
        fetchTrendingTags,
        dismissMsgBox
      }}
    >
      {props.children}
    </TweetsContext.Provider>
  );
};

export default TweetsState;
