import {
  FETCH_TRENDING_TAGS,
  FETCH_RESULT,
  ADD_TAG,
  REMOVE_TAG,
  UPDATE_QUERY,
  SET_CHART_CONTROL
} from '../action';

import _ from 'lodash';

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

export default (state = initState, action) => {
  switch (action.type) {
    case FETCH_TRENDING_TAGS:
      return {
        ...state,
        trends: action.payload
      };

    case FETCH_RESULT:
      return {
        ...state,
        result: action.payload
      };

    case UPDATE_QUERY:
      // New value
      const { id, value } = action.payload;

      return {
        ...state,
        queries: state.queries.map(tag =>
          // If the id is match
          // Update the value, otherwise return the previos tag value
          tag.id === id ? { ...tag, value } : tag
        )
      };

    case ADD_TAG:
      /* 
        There are two main step for insert Tags in the queries
        1: Deep copy the previous queries so that we can modify it
        2: Add the new value at the end of the queries 
           by user selecting the tag they want
        3: Only keep the unique hashtag value in the queries
          (Removes the duplicate hashtag value to make it clean)
      */
      const queries = _.uniqBy(
        [
          ...state.queries,
          {
            id: uuidv4(),
            value: action.payload,
            removable: true
          }
        ],
        'value'
      );

      return {
        ...state,
        queries
      };
    // Filter out the target which match the targer id
    case REMOVE_TAG:
      return {
        ...state,
        queries: state.queries.filter(tag => tag.id !== action.payload)
      };

    case SET_CHART_CONTROL:
      return {
        ...state,
        chartControl: action.payload
      };
    default:
      return state;
  }
};
