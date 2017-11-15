/* eslint-disable import/prefer-default-export */

import { GET_INITIAL_POPULATION } from '../constants';

export function getBeats() {
  return {
    type: GET_INITIAL_POPULATION,
  };
}
