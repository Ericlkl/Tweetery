import React, { useReducer } from 'react';
import {
  FETCH_TRENDING_TAGS,
  FETCH_RESULT,
  ADD_TAG,
  REMOVE_TAG,
  UPDATE_QUERY
} from '../action';
import TweetsContext from './TweetsContext';
import TweetsReducer from './TweetsReducer';
import uuidv4 from 'uuid/v4';

const initState = {
  trends: ['Trump', 'Pikachu', 'Star War'],
  query: {
    tags: [
      {
        id: uuidv4(),
        value: '',
        removable: false
      }
    ]
  },
  result: {}
};

const TweetsState = props => {
  const [state, dispatch] = useReducer(TweetsReducer, initState);

  const fetchResult = () =>
    dispatch({
      type: FETCH_RESULT,
      payload: []
    });

  const fetchTrendingTags = () =>
    dispatch({
      type: FETCH_TRENDING_TAGS,
      payload: ['Pizza', 'Hut', 'Green Tea']
    });

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
  const addTag = () => dispatch({ type: ADD_TAG });

  // Remove Tag in the query
  const removeTag = id =>
    dispatch({
      type: REMOVE_TAG,
      payload: id
    });

  return (
    <TweetsContext.Provider
      value={{
        trends: state.trends,
        query: state.query,
        result: state.result,
        addTag,
        removeTag,
        fetchResult,
        updateQuery,
        fetchTrendingTags
      }}
    >
      {props.children}
    </TweetsContext.Provider>
  );
};

export default TweetsState;
