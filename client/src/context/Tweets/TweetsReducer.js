import {
  ADD_TAG,
  REMOVE_TAG,
  SHOW_MSG_BOX,
  DISMISS_MSG_BOX,
  UPDATE_QUERY,
  UPDATE_STREAM_DATA,
  FETCH_RESULT,
  FETCHING_RESULT,
  FETCH_TRENDING_TAGS,
  SET_CHART_CONTROL,
  SWITCH_STREAM_MODE
} from '../action';

import _ from 'lodash';
import moment from 'moment';
import uuidv4 from 'uuid/v4';

export default (state, action) => {
  switch (action.type) {
    case FETCH_TRENDING_TAGS:
      return {
        ...state,
        trends: action.payload
      };

    case UPDATE_STREAM_DATA:
      const updateQuery = Object.keys(action.payload)[0];
      const currentTime = moment(Date.now()).format('HH:mm:ss');

      console.log('Previous State');
      console.log(state.result.values[updateQuery]);

      const values = {
        ...state.result.values,
        [updateQuery]: {
          ...state.result.values[updateQuery],
          [currentTime]: action.payload[updateQuery]
        }
      };

      console.log('Values');
      console.log(values);

      return {
        ...state,
        result: {
          values: {
            ...state.result.values,
            [updateQuery]: {
              ...state.result.values[updateQuery],
              [currentTime]: action.payload[updateQuery]
            }
          },
          isloading: false
        }
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

    case SWITCH_STREAM_MODE:
      return {
        ...state,
        result: {
          values: {},
          isloading: false
        },
        streamMode: action.payload
      };
    case SET_CHART_CONTROL:
      return {
        ...state,
        chartControl: action.payload
      };

    case FETCHING_RESULT:
      return {
        ...state,
        result: {
          isloading: true,
          values: {}
        }
      };
    case SHOW_MSG_BOX:
      return {
        ...state,
        messageBox: action.payload
      };

    case DISMISS_MSG_BOX:
      return {
        ...state,
        messageBox: {
          ...state.messageBox,
          show: false
        }
      };
    default:
      return state;
  }
};
