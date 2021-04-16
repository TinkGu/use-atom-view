import { BaseAtom } from './types';

function view<T, U>(atom: BaseAtom<T>): T;
function view<T, U>(atom: BaseAtom<T>, viewer: (x: T) => U): U;
function view<T, U>(atom: BaseAtom<T>, viewer?: (x: T) => U) {
  if (viewer) {
    return viewer(atom.get());
  }
  return atom.get();
}

function merge<T extends Record<string, any>>(atom: BaseAtom<T>, value: Partial<T>) {
  atom.set(Object.assign(view(atom), value));
}

function modify<T>(atom: BaseAtom<T>, setter: (current: T) => T) {
  const value = setter(view(atom));
  atom.set(value);
}

export { view, merge, modify };
