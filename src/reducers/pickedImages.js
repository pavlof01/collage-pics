import { ADD_PHOTO } from '../actions/pickImages';

const initial = [];

export default (state = initial, action) => {
  switch (action.type) {
    case ADD_PHOTO:
      const newArray = state;
      const isExist = newArray.includes(action.photo);
      if (isExist) {
        const bb = newArray.filter(image => image !== action.photo);
        return bb;
      }
      return [...state, action.photo];
    default:
      return state;
  }
};
