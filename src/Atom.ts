import { getState, notify, setState, subscribe, uuid } from './cache';
import { modify, merge } from './operators';
import { BaseAtom, AtomListener } from './types';

export class Atom<T> implements BaseAtom<T> {
  readonly id: number;

  static of<S>(value: S): Atom<S> {
    return new Atom(value);
  }

  constructor(value: T) {
    this.id = uuid();
    setState(this.id, value);
  }

  get() {
    return getState<T>(this.id);
  }

  set(value: T) {
    const prev = this.get();
    setState(this.id, value);
    notify(this.id, this.get(), prev);
    return this;
  }

  modify(setter: (current: T) => T) {
    modify(this, setter);
    return this;
  }

  merge(value: Partial<T>) {
    merge(this, value);
    return this;
  }

  subscribe(cb: AtomListener<T>) {
    return subscribe(this.id, cb);
  }
}
