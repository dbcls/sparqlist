import Ember from 'ember';

export function toJson([obj]) {
  return JSON.stringify(obj, null, 2);
}

export default Ember.Helper.helper(toJson);
