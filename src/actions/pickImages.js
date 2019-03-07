export const ADD_PHOTO = 'ADD_PHOTO';

export function addPhoto(photo) {
  return {
    type: ADD_PHOTO,
    photo,
  };
}
