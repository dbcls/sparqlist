import { helper } from '@ember/component/helper';

export function pathToUrl([path]) {
  return location.origin + path;
}

export default helper(pathToUrl);
