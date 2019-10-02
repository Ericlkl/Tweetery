import {
  FETCH_TRENDING_TAGS,
  FETCH_RESULT,
  ADD_TAG,
  REMOVE_TAG,
  UPDATE_QUERY
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
    case UPDATE_QUERY:
      // New value
      const { id, value } = action.payload;
      console.log(state.query.tags);
      return {
        ...state,
        query: {
          tags: state.query.tags.map(tag =>
            // If the id is match
            // Update the value, otherwise return the previos tag value
            tag.id === id ? { ...tag, value } : tag
          )
        }
      };
    case ADD_TAG:
      // Deep Copy a tags array from previous state
      // And add new tag instance to query.tags
      return {
        ...state,
        query: {
          tags: [
            ...state.query.tags,
            {
              id: uuidv4(),
              value: '',
              removable: true
            }
          ]
        }
      };
    // Filter out the target which match the targer id
    case REMOVE_TAG:
      return {
        ...state,
        query: {
          tags: state.query.tags.filter(tag => tag.id !== action.payload)
        }
      };
    default:
      return state;
  }
};
