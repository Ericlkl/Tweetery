import {
  FETCH_TRENDING_TAGS,
  FETCH_RESULT,
  ADD_TAG,
  REMOVE_TAG
} from '../action';

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
    case ADD_TAG:
      return {
        ...state,
        query: state.query.push({
          id: uuidv4(),
          value: '',
          removable: true
        })
      };
    case REMOVE_TAG:
      return {
        ...state,
        trending: action.payload
      };
    default:
      return state;
  }
};
