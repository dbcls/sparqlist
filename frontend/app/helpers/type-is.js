import { helper } from '@ember/component/helper';
import { is } from 'type-is';

export function typeIs([mediaType, types]) {
  return is(mediaType, types);
}

export default helper(typeIs);
