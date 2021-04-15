import { getState, setState, uuid, subscribe, notify } from './cache';

class Atom<T> {
  readonly id: number;

  static of<S>(value: S): Atom<S> {
    return new Atom(value);
  }

  constructor(value: T) {
    this.id = uuid();
    setState(this, value);
  }
}

function view<T>(atom: Atom<T>) {
  return getState(atom);
}

function set<T>(atom: Atom<T>, value: T) {
  const prev = view(atom);
  setState(atom, value);
  notify(atom, view(atom), prev);
}

function merge<T>(atom: Atom<T>, value: Partial<T>) {
  set(atom, Object.assign(view(atom), value));
}

function modify<T>(atom: Atom<T>, setter: (current: T) => T) {
  const value = setter(view(atom));
  set(atom, value);
}

export { Atom, view, set, merge, modify, subscribe };
