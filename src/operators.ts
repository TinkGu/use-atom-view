import { Atom } from './atom';
import { getState, setState, subscribe, notify } from './cache';

function view<T>(atom: Atom<T>) {
  return getState<T>(atom);
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

export { view, set, merge, modify, subscribe };
