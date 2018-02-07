import { helper } from '@ember/component/helper';

export function toJson([obj]) {
  return JSON.stringify(obj, null, 2);
}

export default helper(toJson);
