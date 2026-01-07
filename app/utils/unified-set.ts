

/**
 * Dynamically set a nested value into an object using a key path.
 * Modifies the given initial object.
 *
 * @example
 * unSet({}, 'name', 'ra')
 * // => { name: 'ra' }
 *
 * @example
 * unSet({}, 'cards[0].value', 2)
 * // => { cards: [{ value: 2 }] }
 */

export function unSet(target: any, key: string, value: any) {

  const segments = (
    key
      .replace(/\[(\d+)\]/g, '.$1')
      .split('.')
      .filter(Boolean)
  );

  if (segments.length === 0) {
    return target;
  }


  let current = target;


  for (let i = 0; i < segments.length - 1; i++) {

    const segment = segments[i]!;
    const nextSegment = segments[i + 1]!;
    const isNextArray = /^\d+$/.test(nextSegment);

    if (current[segment] === undefined || current[segment] === null) {
      current[segment] = isNextArray ? [] : {};
    }

    current = current[segment];

  }


  const lastSegment = segments[segments.length - 1]!;
  current[lastSegment] = value;

  return target;

}
