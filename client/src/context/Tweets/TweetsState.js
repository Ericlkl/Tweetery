import React, { useReducer } from 'react';
import {
  FETCH_TRENDING_TAGS,
  FETCH_RESULT,
  ADD_TAG,
  REMOVE_TAG
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

  const fetchResult = () => {
    dispatch({
      action: FETCH_RESULT,
      payload: []
    });
  };

  const fetchTrendingTags = () => {
    dispatch({
      action: FETCH_TRENDING_TAGS,
      payload: []
    });
  };

  // Remove Tag in the query
  const addTag = id => dispatch({ action: ADD_TAG });

  // Remove Tag in the query
  const removeTag = id => {
    dispatch({
      action: REMOVE_TAG,
      payload: id
    });
  };

  return (
    <TweetsContext.Provider
      value={{
        trends: state.trends,
        query: state.query,
        result: state.result,
        addTag,
        removeTag,
        fetchResult,
        fetchTrendingTags
      }}
    >
      {props.children}
    </TweetsContext.Provider>
  );
};

export default TweetsState;
