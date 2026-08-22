# Radashi auto-imports (`radXxx`)

Layer module `modules/radashi.ts` registers every runtime export from `radashi` as a Nuxt auto-import in both the Vue app (`addImports`) and Nitro server (`addServerImports`):

```text
rad + PascalCase(originalName)
```

Examples: `get` → `radGet`, `pick` → `radPick`, `camel` → `radCamel`, `try` → `radTry`, `tryit` → `radTryit`.

Prefer these `rad*` auto-imports in apps that extend `nuxt-unified-ui` instead of importing from `radashi` directly.

Catalog generated from radashi `12.9.1` types bundled with this layer.

| Auto-import | Original | Description | Typing |
|---|---|---|---|
| `radAggregateError` | `AggregateError` | The `AggregateError` object represents an error when several errors need to be wrapped in a single error. | `const AggregateError: AggregateErrorConstructor` |
| `radDefaultCloningStrategy` | `DefaultCloningStrategy` | — | `const DefaultCloningStrategy: CloningStrategy` |
| `radDurationParser` | `DurationParser` | Parses a duration string into its numeric value. | `class DurationParser { constructor(options?: DurationParser.Options<TUnit, TShortUnit>) }` |
| `radFastCloningStrategy` | `FastCloningStrategy` | If you don't need support for non-enumerable properties or computed properties, and you're not using custom classes, you can use this strategy for better performance. | `const FastCloningStrategy: { cloneObject: <T extends object>(input: T, track: (newParent: T) => T, clone: <T_1>(value: T_1) => T_1) => T; }` |
| `radQuantityParser` | `QuantityParser` | Parses a quantity string into its numeric value. | `class QuantityParser { constructor({ units, short }: QuantityParser.Options<Unit, ShortUnit>) }` |
| `radSemaphore` | `Semaphore` | Implements a counting semaphore that controls access to a limited resource. | `class Semaphore { constructor(maxCapacity: number) }` |
| `radSemaphorePermit` | `SemaphorePermit` | A permit that can be acquired from a {@link Semaphore}. | `class SemaphorePermit { constructor(semaphore: Semaphore, request: PromiseWithResolvers<void>, weight: number) }` |
| `radTimeoutError` | `TimeoutError` | — | `class TimeoutError extends Error { constructor(message?: string) }` |
| `radAbsoluteJitter` | `absoluteJitter` | Returns a value randomly jittered by an absolute offset. | `function absoluteJitter(base: number, offset: number): number;` |
| `radAll` | `all` | Wait for all promises to resolve. | `function all<T extends readonly [unknown, ...unknown[]]>(input: T): Promise<{ -readonly [I in keyof T]: Awaited<T[I]>; }>; (+2 overloads)` |
| `radAlphabetical` | `alphabetical` | Sort an array without modifying it and return the newly sorted value. | `function alphabetical<T>(array: readonly T[], getter: (item: T) => string, direction?: 'asc' \| 'desc'): T[];` |
| `radAlways` | `always` | Create a function that always returns the same value. | `function always<T>(value: T): () => T;` |
| `radAssert` | `assert` | Asserts that a condition is true. | `function assert(condition: false, error?: string \| Error): never; (+1 overload)` |
| `radAssign` | `assign` | Create a copy of the first object, and then merge the second object into it recursively. | `function assign<TInitial extends Record<keyof any, any>, TOverride extends Record<keyof any, any>>(initial: TInitial, override: TOverride): Assign<TInitial, …` |
| `radBoil` | `boil` | Go through a list of items, starting with the first item, and comparing with the second. | `function boil<T>(array: readonly T[], compareFunc: (a: T, b: T) => T): T \| null;` |
| `radCallable` | `callable` | Make an object callable. | `function callable<TValue, TObj extends Record<string \| number \| symbol, TValue>, TFunc extends (...args: any) => any>(obj: TObj, fn: (self: TObj) => TFunc): …` |
| `radCamel` | `camel` | Formats the given string in camel case fashion. | `function camel(str: string): string;` |
| `radCapitalize` | `capitalize` | Capitalize the first word of the string. | `function capitalize(str: string): string;` |
| `radCartesianProduct` | `cartesianProduct` | Create an [n-ary Cartesian product](https://en.wikipedia.org/wiki/Cartesian_product#n-ary_Cartesian_product) from the given arrays. | `function cartesianProduct<const T extends ReadonlyArray2D<any>>(...arrays: [...T]): Array<{ [K in keyof T]: T[K][number]; }>;` |
| `radCastArray` | `castArray` | Casts the given value to an array. | `function castArray<T>(value: T): CastArray<T>;` |
| `radCastArrayIfExists` | `castArrayIfExists` | Casts the given value to an array if it's not equal to `null` or `undefined`. | `function castArrayIfExists<T>(value: T): CastArrayIfExists<T>;` |
| `radCastComparator` | `castComparator` | Cast a value into a comparator function. | `function castComparator<TMapping extends keyof any>(mapping: TMapping, compare?: null \| undefined, reverse?: boolean): Comparator<MappedInput<TMapping, Compa…` |
| `radCastMapping` | `castMapping` | Cast the `mapping` value into a mapping function. | `function castMapping<TMapping extends Mapping \| null \| undefined>(mapping: TMapping): MappingFunction<TMapping>;` |
| `radChain` | `chain` | Create a function that chains multiple functions together. | `function chain<T1 extends any[], T2, T3>(f1: (...arg: T1) => T2, f2: (arg: T2) => T3): (...arg: T1) => T3; (+8 overloads)` |
| `radClamp` | `clamp` | The `clamp` function restricts a number to be within a specified range. | `function clamp(n: number, min: number \| null \| undefined, max: number \| null \| undefined): number;` |
| `radClone` | `clone` | Creates a shallow copy of the given object/value. | `function clone<T>(obj: T): T;` |
| `radCloneDeep` | `cloneDeep` | Clone the given object and possibly other objects nested inside. | `function cloneDeep<T extends object>(root: T, customStrategy?: Partial<CloningStrategy>): T;` |
| `radCluster` | `cluster` | Splits a single list into many lists of the desired size. | `function cluster<T, Size extends number = 2>(array: readonly T[], size?: Size): Cluster<T, Size>[];` |
| `radCompose` | `compose` | Create a function that composes multiple functions together. | `function compose<F1Result, F1Args extends any[], F1NextArgs extends any[], LastResult>(f1: (next: (...args: F1NextArgs) => LastResult) => (...args: F1Args) =…` |
| `radConcat` | `concat` | Flattens and filters nullish values from arguments, returning a new array containing only the non-nullish elements. | `function concat<T extends readonly [any, any, ...any[]]>(...values: T): Concat<T>;` |
| `radConstruct` | `construct` | The opposite of crush, given an object that was crushed into key paths and values will return the original object reconstructed. | `function construct<TObject extends object>(obj: TObject): object;` |
| `radCounting` | `counting` | Counts the occurrences of each unique value returned by the `identity` function when applied to each item in the array. | `function counting<T, TId extends string \| number \| symbol>(array: readonly T[], identity: (item: T) => TId): Record<TId, number>;` |
| `radCrush` | `crush` | Flattens a deep object to a single dimension, converting the keys to dot notation. | `function crush<T extends object>(value: T): Crush<T>;` |
| `radDash` | `dash` | Formats the given string in dash case fashion. | `function dash(str: string): string;` |
| `radDebounce` | `debounce` | Returns a new function that will only call your callback after `delay` milliseconds have passed without any invocations. | `function debounce<TArgs extends any[]>({ delay, leading }: DebounceOptions, func: (...args: TArgs) => any): DebounceFunction<TArgs>;` |
| `radDeburr` | `deburr` | Removes accents and converts extended Latin ligatures to basic Latin text. | `function deburr(input: string): string;` |
| `radDedent` | `dedent` | Remove indentation from a string. | `function dedent(template: TemplateStringsArray, ...values: unknown[]): string; (+1 overload)` |
| `radDefer` | `defer` | Useful when for script like things where cleanup should be done on fail or success no matter. | `function defer<TResponse>(func: (register: (fn: (error?: any) => any, options?: { rethrow?: boolean; }) => void) => Promise<TResponse>): Promise<TResponse>;` |
| `radDiff` | `diff` | Returns all items from the first list that do not exist in the second list. | `function diff<T>(root: readonly T[], other: readonly T[], identity?: (item: T) => string \| number \| symbol): T[];` |
| `radDraw` | `draw` | “Draw” a random item from an array. | `function draw<const T extends readonly any[]>(array: T): T extends readonly [any, ...any[]] ? T[number] : T[number] \| null;` |
| `radEscapeHTML` | `escapeHTML` | Escape HTML characters in a string. | `function escapeHTML(input: string): string;` |
| `radFilterKey` | `filterKey` | Returns true if the key is in the “keys array” or if the “filter function” returns true. | `function filterKey<T extends object>(obj: T, key: keyof T, filter: KeyFilter<T, keyof T> \| null \| undefined): boolean; (+1 overload)` |
| `radFirst` | `first` | Get the first item in an array or a default value. | `function first<const TArray extends readonly any[], const TDefault = undefined>(array: TArray, defaultValue?: TDefault): TArray extends readonly [infer TFirs…` |
| `radFlat` | `flat` | Given an array of arrays, returns a single dimensional array with all items in it. | `function flat<T>(lists: readonly T[][]): T[];` |
| `radFlip` | `flip` | Flip the first two arguments of a function. | `function flip<Args extends any[], Result>(fn: (...args: Args) => Result): (...args: Flip<Args>) => Result;` |
| `radFork` | `fork` | Split an array into two array based on a true/false condition function. | `function fork<T>(array: readonly T[], condition: (item: T) => boolean): [T[], T[]];` |
| `radGet` | `get` | Dynamically get a nested value from an array or object with a string. | `function get<TDefault = unknown>(value: any, path: string, defaultValue?: TDefault): TDefault;` |
| `radGetErrorMessage` | `getErrorMessage` | Gets a readable message from an unknown error value. | `function getErrorMessage(error: unknown): string;` |
| `radGetOrInsert` | `getOrInsert` | Returns a map entry or stores and returns the provided value when missing. | `function getOrInsert<K, V>(map: Map<K, V>, key: K, value: V): V; (+1 overload)` |
| `radGetOrInsertComputed` | `getOrInsertComputed` | Returns a map entry or stores the computed value when the key is missing. | `function getOrInsertComputed<K, V>(map: Map<K, V>, key: K, factory: () => V): V; (+1 overload)` |
| `radGroup` | `group` | Categorizes elements from an `array` into distinct groups. | `function group<T, Key extends string \| number \| symbol>(array: readonly T[], getGroupId: (item: T, index: number) => Key): { [K in Key]?: T[]; };` |
| `radGuard` | `guard` | A helper to try an async function that returns undefined if it fails. | `function guard<TFunction extends () => any>(func: TFunction, shouldGuard?: (err: any) => boolean): GuardReturnType<TFunction>;` |
| `radIdentity` | `identity` | A function that returns the value passed to it. | `function identity(): undefined; (+1 overload)` |
| `radInRange` | `inRange` | Checks if the given number is between zero (0) and the ending number. | `function inRange(number: number, end: number): boolean; (+1 overload)` |
| `radIntersects` | `intersects` | Given two arrays, returns true if any elements intersect. | `function intersects<T, K>(listA: readonly T[], listB: readonly T[], identity?: (t: T) => K): boolean;` |
| `radInvert` | `invert` | Returns a new object whose keys are the values of the given object and its values are the keys of the given object. | `function invert<TKey extends string \| number \| symbol, TValue extends string \| number \| symbol>(obj: Record<TKey, TValue>): Record<TValue, TKey>;` |
| `radIsArray` | `isArray` | Literally just `Array.isArray` but with better type inference. | `const isArray: <Input>(value: Input) => value is ExtractArray<Input>` |
| `radIsArrayEqual` | `isArrayEqual` | Checks if two arrays are equal in length and content using `Object.is` comparison. | `function isArrayEqual<T>(array1: T[], array2: T[]): boolean;` |
| `radIsAsyncIterable` | `isAsyncIterable` | Checks if a value is an async iterable. | `function isAsyncIterable(value: unknown): value is AsyncIterable;` |
| `radIsBigInt` | `isBigInt` | Return true if the give value is a BigInt. | `function isBigInt(value: unknown): value is bigint;` |
| `radIsBoolean` | `isBoolean` | — | `function isBoolean(value: unknown): value is boolean;` |
| `radIsClass` | `isClass` | Checks if the given value is a class. | `function isClass<T>(value: T): value is ExtractClass<T>;` |
| `radIsDangerousKey` | `isDangerousKey` | Check if a property key is “dangerous” in the sense that it could be used to modify built-in objects, possibly leading to prototype pollution or other unintended side effects. | `function isDangerousKey(key: PropertyKey, object?: object): boolean;` |
| `radIsDate` | `isDate` | Return true if the given value is a Date object. | `function isDate(value: unknown): value is Date;` |
| `radIsEmpty` | `isEmpty` | Return true if the given value is empty. | `function isEmpty<T extends ToEmptyAble>(value: T): value is ToEmpty<T>; (+1 overload)` |
| `radIsEqual` | `isEqual` | Return true if the given values are equal. | `function isEqual<TType>(x: TType, y: TType): boolean;` |
| `radIsError` | `isError` | Return true if the given value is an Error object. | `function isError(value: unknown): value is Error;` |
| `radIsFloat` | `isFloat` | Return true if the given value is a number that is not an integer. | `function isFloat(value: any): value is number;` |
| `radIsFunction` | `isFunction` | Return true if the given value is a function. | `function isFunction(value: any): value is Function;` |
| `radIsInt` | `isInt` | Literally just `Number.isInteger` with a better type. | `const isInt: (value: unknown) => value is number` |
| `radIsIntString` | `isIntString` | Return true if the given value is a string that can be parsed as an integer. | `function isIntString(value: any): value is `${number}`;` |
| `radIsIterable` | `isIterable` | — | `function isIterable(value: unknown): value is Iterable<unknown>;` |
| `radIsMap` | `isMap` | Return true if the given value is a Map. | `function isMap<Input>(value: Input): value is ExtractMap<Input>;` |
| `radIsMapEqual` | `isMapEqual` | Check if two maps are equal. | `function isMapEqual(x: Map<any, any>, y: Map<any, any>): boolean;` |
| `radIsNullish` | `isNullish` | Return true if the given value is null or undefined. | `function isNullish(value: unknown): value is null \| undefined;` |
| `radIsNumber` | `isNumber` | Return true if the given value is a number. | `function isNumber(value: unknown): value is number;` |
| `radIsObject` | `isObject` | Returns true if `value` is a plain object, a class instance (excluding built-in classes like Date/RegExp), or an `Object.create(null)` result. | `function isObject(value: unknown): value is object;` |
| `radIsPlainObject` | `isPlainObject` | Return true if the given value is a plain object. | `function isPlainObject(value: any): value is object;` |
| `radIsPrimitive` | `isPrimitive` | Checks if the given value is primitive. | `function isPrimitive(value: any): boolean;` |
| `radIsPromise` | `isPromise` | Returns true if the value is a Promise or has a `then` method. | `function isPromise(value: any): value is PromiseLike<unknown>;` |
| `radIsRegExp` | `isRegExp` | Checks if the given value is a RegExp. | `function isRegExp(value: unknown): value is RegExp;` |
| `radIsResult` | `isResult` | Returns true if the value is a `Result` tuple. | `function isResult(value: unknown): value is Result<unknown>;` |
| `radIsResultErr` | `isResultErr` | Returns true if the value is an `Err` result. | `function isResultErr<TError extends Error = Error>(value: unknown): value is Err<TError>;` |
| `radIsResultOk` | `isResultOk` | Returns true if the value is an `Ok` result. | `function isResultOk<TValue = unknown>(value: unknown): value is Ok<TValue>;` |
| `radIsSet` | `isSet` | Checks if the given value is a Set. | `function isSet<Input>(value: Input): value is ExtractSet<Input>;` |
| `radIsSetEqual` | `isSetEqual` | Check if two sets are equal. | `function isSetEqual(x: Set<any>, y: Set<any>): boolean;` |
| `radIsString` | `isString` | Checks if the given value is a string. | `function isString(value: unknown): value is string;` |
| `radIsSymbol` | `isSymbol` | Checks if the given value is a symbol. | `function isSymbol(value: unknown): value is symbol;` |
| `radIsTagged` | `isTagged` | Compare the given tag to the result of `Object.prototype.toString`. | `function isTagged(value: unknown, tag: string): boolean;` |
| `radIsUndefined` | `isUndefined` | Checks if the given value is undefined. | `function isUndefined(value: unknown): value is undefined;` |
| `radIsWeakMap` | `isWeakMap` | Checks if the given value is a WeakMap. | `function isWeakMap<K extends WeakKey = WeakKey, V = unknown>(value: unknown): value is WeakMap<K, V>;` |
| `radIsWeakSet` | `isWeakSet` | Checks if the given value is a WeakSet. | `function isWeakSet<T extends WeakKey = WeakKey>(value: unknown): value is WeakSet<T>;` |
| `radIterate` | `iterate` | Like a reduce but does not require an array. | `function iterate<T>(count: number, func: (currentValue: T, iteration: number) => T, initValue: T): T;` |
| `radKeys` | `keys` | Get a string list of all key names that exist in an object (deep). | `function keys(value: object): string[];` |
| `radLast` | `last` | Get the last item in an array or a default value. | `function last<const TArray extends readonly any[], const TDefault = undefined>(array: TArray, defaultValue?: TDefault): TArray extends readonly [...any[], in…` |
| `radLerp` | `lerp` | Linearly interpolates between two numbers. | `function lerp(from: number, to: number, amount: number): number;` |
| `radList` | `list` | Creates a list of given start, end, value, and step parameters. | `function list<T = number>(startOrLength: number, end?: number, valueOrMapper?: T \| ((i: number) => T), step?: number): T[];` |
| `radListify` | `listify` | Convert an object to a list, mapping each entry into a list item. | `function listify<Value, Key extends string \| number \| symbol, Item>(obj: Record<Key, Value>, toItem: (key: Key, value: Value) => Item): Item[];` |
| `radLowerize` | `lowerize` | Convert all keys in an object to lower case. | `function lowerize<T extends Record<string, any>>(obj: T): LowercaseKeys<T>;` |
| `radMap` | `map` | An async map function. | `function map<T, K>(array: readonly T[], asyncMapFunc: (item: T, index: number) => PromiseLike<K>): Promise<K[]>;` |
| `radMapEntries` | `mapEntries` | Map over all the keys to create a new object. | `function mapEntries<TKey extends string \| number \| symbol, TValue, TNewKey extends string \| number \| symbol, TNewValue>(obj: Record<TKey, TValue>, toEntry: (…` |
| `radMapKeys` | `mapKeys` | Map over all the keys of an object to return a new object. | `function mapKeys<TValue, TKey extends string \| number \| symbol, TNewKey extends string \| number \| symbol>(obj: Record<TKey, TValue>, mapFunc: (key: TKey, val…` |
| `radMapValues` | `mapValues` | Map over all the keys to create a new object. | `function mapValues<T extends object, U>(obj: T, mapFunc: (value: Required<T>[keyof T], key: keyof T) => U): { [K in keyof T]: U; };` |
| `radMapify` | `mapify` | Create a new `Map` instance from an array. | `function mapify<T, Key, Value = T>(array: readonly T[], getKey: (item: T, index: number) => Key, getValue?: (item: T, index: number) => Value): Map<Key, Value>;` |
| `radMax` | `max` | Max gets the greatest value from a list. | `function max(array: readonly [number, ...number[]]): number; (+3 overloads)` |
| `radMemo` | `memo` | Creates a memoized function. | `function memo<TArgs extends any[], TResult>(func: (...args: TArgs) => TResult, options?: MemoOptions<NoInfer$1<TArgs>>): (...args: TArgs) => TResult;` |
| `radMemoLastCall` | `memoLastCall` | Creates a memoized version of a function that caches only its most recent call. | `function memoLastCall<Args extends any[], Result>(fn: (...args: Args) => Result): (...args: Args) => Result;` |
| `radMerge` | `merge` | Given two arrays of the same type, iterate the first list and replace items matched by the `matcher` function in the first place. | `function merge<T>(prev: readonly T[], array: readonly T[], toKey: (item: T) => any): T[];` |
| `radMergeOptions` | `mergeOptions` | Merges two option objects into a new object. | `function mergeOptions<A extends object \| undefined, B extends object \| undefined>(a: A, b: B): MergeOptions<A, B>;` |
| `radMin` | `min` | Min gets the smallest value from a list. | `function min(array: readonly [number, ...number[]]): number; (+3 overloads)` |
| `radNoop` | `noop` | A callback that does nothing and returns undefined. | `function noop(): undefined;` |
| `radObjectify` | `objectify` | Convert an array to a dictionary by mapping each item into a dictionary key & value. | `function objectify<T, Key extends string \| number \| symbol, Value = T>(array: readonly T[], getKey: (item: T, index: number) => Key, getValue?: (item: T, ind…` |
| `radOmit` | `omit` | Omit a list of properties from an object returning a new object with the properties that remain. | `function omit<T, TKeys extends keyof T>(obj: T, keys: readonly TKeys[]): Omit<T, TKeys>;` |
| `radOnce` | `once` | Create a function that runs at most once, no matter how many times it's called. | `const once: Once` |
| `radParallel` | `parallel` | Executes many async functions in parallel. | `function parallel<T, K>(options: ParallelOptions \| number, array: readonly T[], func: (item: T) => Promise<K>): Promise<K[]>;` |
| `radParseDuration` | `parseDuration` | Parse a duration string into a number. | `function parseDuration(duration: DurationString): number; (+1 overload)` |
| `radParseQuantity` | `parseQuantity` | Parse a quantity string into its numeric value. | `function parseQuantity<TUnit extends string, TShortUnit extends string = never>(quantity: QuantityString<TUnit, TShortUnit>, options: QuantityParser.Options<…` |
| `radPartial` | `partial` | Create a partial function by providing some (or all) of the arguments the given function needs. | `function partial<T extends any[], TA extends Partial<T>, R>(fn: (...args: T) => R, ...args: TA): (...rest: RemoveItemsInFront<T, TA>) => R;` |
| `radPartob` | `partob` | Like partial but for unary functions that accept a single object argument const add = ( {a = 0, b = 0, c = 0}: { a?: number, b?: number, c?: number } ) => a + b + c const addPartia | `function partob<T, K, PartialArgs extends Partial<T>>(fn: (args: T) => K, argObj: PartialArgs): (restObj: Omit<T, keyof PartialArgs>) => K;` |
| `radPascal` | `pascal` | Formats the given string in pascal case fashion. | `function pascal(str: string): string;` |
| `radPick` | `pick` | Pick a list of properties from an object into a new object. | `function pick<T extends object, F extends KeyFilter<T, keyof T>>(obj: T, filter: F): Pick<T, FilteredKeys<T, F>>;` |
| `radPluck` | `pluck` | Extracts values from an array of objects based on specified mappings. | `function pluck<T extends object, TMapping extends Mapping<T>>(array: readonly T[], mappings: readonly TMapping[]): MappedOutput<TMapping, T>[]; (+1 overload)` |
| `radPromiseChain` | `promiseChain` | Creates a function that executes multiple functions in the same order as they are passed in arguments. | `function promiseChain<T1 extends any[], T2, T3>(f1: (...args: T1) => Awaitable<T2>, f2: (arg: T2) => Awaitable<T3>): (...arg: T1) => Promise<T3>; (+8 overloads)` |
| `radProportionalJitter` | `proportionalJitter` | Returns a value randomly jittered by a proportion of the base value. | `function proportionalJitter(base: number, factor: number): number;` |
| `radProxied` | `proxied` | Creates a Proxy object that will dynamically call the handler argument when attributes are accessed. | `function proxied<T, K>(handler: (propertyName: T) => K): Record<string, K>;` |
| `radQueueByKey` | `queueByKey` | Queues async function calls by key to ensure sequential execution per key. | `function queueByKey<TArgs extends any[], TResult>(asyncFn: (...args: TArgs) => TResult \| PromiseLike<TResult>, keyFn: (...args: TArgs) => string \| number): (…` |
| `radRandom` | `random` | Generates a random integer between min and max. | `function random(min: number, max: number): number;` |
| `radRange` | `range` | Creates a generator that will produce an iteration through the range of number as requested. | `function range<T = number>(startOrLength: number, end?: number, valueOrMapper?: T \| ((i: number) => T), step?: number): Generator<T>;` |
| `radReduce` | `reduce` | An async reduce function. | `function reduce<T, K>(array: readonly T[], reducer: (acc: K, item: T, index: number) => Promise<K>, initialValue: K): Promise<K>; (+1 overload)` |
| `radRemove` | `remove` | Removes elements from an array based on the specified predicate function. | `function remove<T>(array: readonly T[], predicate: (value: T) => boolean): T[];` |
| `radReplace` | `replace` | Replace an element in an array with a new item without modifying the array and return the new value. | `function replace<T>(array: readonly T[], newItem: T, match: (item: T, idx: number) => boolean): T[];` |
| `radReplaceOrAppend` | `replaceOrAppend` | Replace the first occurrence of an item in an array where the `match` function returns true. | `function replaceOrAppend<T>(array: readonly T[], newItem: T, match: (a: T, idx: number) => boolean): T[];` |
| `radRetry` | `retry` | Retries the given function the specified number of times. | `function retry<TResponse>(options: RetryOptions, func: (exit: (err: any) => void) => Promise<TResponse>): Promise<TResponse>;` |
| `radRound` | `round` | Rounds a number to the given precision. | `function round(value: number, precision?: number, toInteger?: (value: number) => number): number;` |
| `radSelect` | `select` | Select performs a filter and a mapper inside of a reduce, only iterating the list one time. | `function select<T, U>(array: readonly T[], mapper: (item: T, index: number) => U, condition: ((item: T, index: number) => boolean) \| null \| undefined): U[]; …` |
| `radSelectFirst` | `selectFirst` | Select performs a find + map operation, short-circuiting on the first element that satisfies the prescribed condition. | `function selectFirst<T, U>(array: readonly T[], mapper: (item: T, index: number) => U, condition: (item: T, index: number) => boolean): U \| undefined; (+1 ov…` |
| `radSeries` | `series` | Creates a series object around a list of values that should be treated with order. | `const series: <T>(items: readonly T[], toKey?: (item: T) => string \| symbol) => Series<T>` |
| `radSet` | `set` | Opposite of get, dynamically set a nested value into an object using a key path. | `function set<T extends object, K>(initial: T, path: string, value: K): T;` |
| `radShake` | `shake` | Removes (shakes out) undefined entries from an object. | `function shake<T extends object>(obj: T): { [K in keyof T]: Exclude<T[K], undefined>; }; (+1 overload)` |
| `radShift` | `shift` | Shifts array items by `n` steps. | `function shift<T>(arr: readonly T[], n: number): T[];` |
| `radShuffle` | `shuffle` | Create a new array with the items of the given array but in a random order. | `function shuffle<T>( /** * The array to shuffle. */ array: readonly T[], /** * You can provide a custom random function to make the shuffle more or less * ra…` |
| `radSift` | `sift` | Given a list returns a new list with only truthy values. | `function sift<T>(array: readonly (T \| Falsy)[]): T[];` |
| `radSimilarity` | `similarity` | Calculate the similarity between two strings using the Levenshtein distance algorithm. | `function similarity(str1: string, str2: string): number;` |
| `radSleep` | `sleep` | Create a promise that resolves after a given amount of time. | `function sleep(milliseconds: number): Promise<void>;` |
| `radSnake` | `snake` | Formats the given string in snake case fashion. | `function snake(str: string, options?: { splitOnNumber?: boolean; }): string;` |
| `radSort` | `sort` | Sort an array without modifying it and return the newly sorted value. | `function sort<const T extends readonly any[]>(array: T, getter?: (item: T[number]) => number, desc?: boolean): SortArray<T>;` |
| `radSum` | `sum` | Add up numbers related to an array in 1 of 2 ways: 1. | `function sum(array: readonly number[]): number; (+1 overload)` |
| `radTemplate` | `template` | Replace data by name in template strings. | `function template(str: string, data: Record<string, any>, regex?: RegExp): string;` |
| `radThrottle` | `throttle` | Given an interval and a function returns a new function that will only call the source function if interval milliseconds have passed since the last invocation. | `function throttle<TArgs extends any[]>({ interval, trailing }: { interval: number; trailing?: boolean; }, func: (...args: TArgs) => any): ThrottledFunction<T…` |
| `radTimeout` | `timeout` | The `timeout` function creates a promise that rejects after a specified delay, with an optional custom error message or error function. | `function timeout<TError extends Error>( /** * The number of milliseconds to wait before rejecting. */ ms: number, /** * An error message or a function that r…` |
| `radTitle` | `title` | Formats the given string in title case fashion. | `function title(str: string \| null \| undefined): string;` |
| `radToFloat` | `toFloat` | Combines `Number.parseFloat` with NaN handling. | `function toFloat(value: unknown): number; (+1 overload)` |
| `radToInt` | `toInt` | Combines `Number.parseInt` with NaN handling. | `function toInt(value: unknown): number; (+1 overload)` |
| `radToResult` | `toResult` | Converts a `PromiseLike` to a `Promise<Result>`. | `function toResult<T>(promise: PromiseLike<T>): Promise<Result<T>>;` |
| `radToggle` | `toggle` | Either adds or removes an item from an array, based on whether it already exists in the array. | `function toggle<T>(array: readonly T[], item: T, toKey?: ((item: T, idx: number) => number \| string \| symbol) \| null, options?: { strategy?: 'prepend' \| 'app…` |
| `radTraverse` | `traverse` | Recursively visit each property of an object (or each element of an array) and its nested objects or arrays. | `function traverse(root: object, visitor: TraverseVisitor, options?: (TraverseOptions & { rootNeedsVisit?: null; }) \| null, outerContext?: TraverseContext): b…` |
| `radTrim` | `trim` | Trims all prefix and suffix characters from the given string. | `function trim(str: string \| null \| undefined, charsToTrim?: string): string;` |
| `radTry` | `try` | Alias of tryit: wrap a function to return [error, result] instead of throwing. | `function tryit<TArgs extends any[], TReturn, TError extends Error = Error>(func: (...args: TArgs) => TReturn): (...args: TArgs) => TryitResult<TReturn, TError>;` |
| `radTryit` | `tryit` | A helper to try an async function without forking the control flow. | `function tryit<TArgs extends any[], TReturn, TError extends Error = Error>(func: (...args: TArgs) => TReturn): (...args: TArgs) => TryitResult<TReturn, TError>;` |
| `radUid` | `uid` | Generate a random string of a given length. | `function uid(length: number, specials?: string): string;` |
| `radUnique` | `unique` | Given a list of items returns a new list with only unique items. | `function unique<T, K = T>(array: readonly T[], toKey?: (item: T) => K): T[];` |
| `radUnzip` | `unzip` | Creates an array of ungrouped elements, where each resulting array contains all elements at a specific index from the input arrays. | `function unzip<T>(arrays: readonly (readonly T[])[]): T[][];` |
| `radUpperize` | `upperize` | Convert all keys in an object to upper case. | `function upperize<T extends Record<string, any>>(obj: T): UppercaseKeys<T>;` |
| `radWithResolvers` | `withResolvers` | Creates a new promise and returns the resolve and reject functions along with the promise itself. | `function withResolvers<T>(): PromiseWithResolvers<T>;` |
| `radZip` | `zip` | Creates an array of grouped elements, the first of which contains the first elements of the given arrays, the second of which contains the second elements of the given arrays, and | `function zip<T1, T2, T3, T4, T5>(array1: readonly T1[], array2: readonly T2[], array3: readonly T3[], array4: readonly T4[], array5: readonly T5[]): [T1, T2,…` |
| `radZipToObject` | `zipToObject` | Creates an object mapping the specified keys to their corresponding values. | `function zipToObject<K extends string \| number \| symbol, V>(keys: readonly K[], values: V \| ((key: K, idx: number) => V) \| readonly V[]): Record<K, V>;` |

## Naming rule

```ts
const as = `rad${radashi.pascal(name)}`
```

So `AggregateError` → `radAggregateError`, `isEqual` → `radIsEqual`, `DefaultCloningStrategy` → `radDefaultCloningStrategy`.
