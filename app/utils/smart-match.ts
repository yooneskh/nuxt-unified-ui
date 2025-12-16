import { matches } from 'unified-mongo-filter';


export function smartMatch(filter: object | ((target: any) => boolean) | any, target: any) {
  if (typeof filter === 'function') {
    return filter(target);
  }
  else if (typeof filter === 'object') {
    return matches(filter, target);
  }
  else {
    return filter;
  }
}
