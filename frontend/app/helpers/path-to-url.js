import Ember from 'ember';

export function pathToUrl([path]) {
  return location.origin + path;
}

export default Ember.Helper.helper(pathToUrl);
