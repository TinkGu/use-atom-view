import { AtomListener, setState, uuid } from './cache';
import { view, subscribe, set, merge, modify } from './operators';

export class Atom<T> {
  readonly id: number;

  static of<S>(value: S): Atom<S> {
    return new Atom(value);
  }

  constructor(value: T) {
    this.id = uuid();
    setState(this, value);
  }

  view() {
    return view(this);
  }

  set(value: T) {
    set(this, value);
    return this;
  }

  merge(value: Partial<T>) {
    merge(this, value);
    return this;
  }

  modify(setter: (current: T) => T) {
    modify(this, setter);
    return this;
  }

  subscribe(cb: AtomListener<T>) {
    return subscribe(this, cb);
  }
}
