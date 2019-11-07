import { helper } from '@ember/component/helper';

export function pathToUrl([path]) {
  return new URL(path, location.origin).toString();
}

export default helper(pathToUrl);
