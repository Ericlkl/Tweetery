import React, { useReducer } from 'react';
import {
  FETCH_TRENDING_TAGS,
  FETCH_RESULT,
  ADD_TAG,
  REMOVE_TAG,
  SET_CHART_CONTROL,
  UPDATE_QUERY
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
  result: {},
  chartControl: 'joy'
};

const TweetsState = props => {
  const [state, dispatch] = useReducer(TweetsReducer, initState);

  const fetchResult = async () => {
    const firstQuery = state.queries[0].value;

    if (firstQuery.length !== 0) {
      const res = await axios.post('/api/tweets/analyse', {
        query: firstQuery
      });

      const payload = {};

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
        payload[query] = {
          ...payload[query],
          [date]: { ...emotions }
        };
      });

      dispatch({
        type: FETCH_RESULT,
        payload
      });
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
      dispatch({
        type: FETCH_TRENDING_TAGS,
        payload: []
      });
    }
  };

  // Updating the query
  // Such as inserting the value in the SearchField
  const updateQuery = (id, value) =>
    dispatch({
      type: UPDATE_QUERY,
      payload: {
        id,
        value
      }
    });

  // Remove Tag in the query
  const addTag = (value = '') =>
    dispatch({
      type: ADD_TAG,
      payload: value
    });

  // Remove Tag in the query
  const removeTag = id =>
    dispatch({
      type: REMOVE_TAG,
      payload: id
    });

  const setChartControl = controlValue => {
    dispatch({
      type: SET_CHART_CONTROL,
      payload: controlValue
    });
  };

  return (
    <TweetsContext.Provider
      value={{
        trends: state.trends,
        queries: state.queries,
        result: state.result,
        chartControl: state.chartControl,
        addTag,
        removeTag,
        fetchResult,
        updateQuery,
        setChartControl,
        fetchTrendingTags
      }}
    >
      {props.children}
    </TweetsContext.Provider>
  );
};

export default TweetsState;
