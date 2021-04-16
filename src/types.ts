export type AtomListener<T> = (cur: T, prev: T) => any;

export interface BaseAtom<T> {
  get(): T;
  set(x: T): any;
  subscribe(cb: AtomListener<T>): () => void;
}
