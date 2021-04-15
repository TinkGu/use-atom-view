import { Atom } from './atom';

export type AtomListener<T> = (cur: T, prev: T) => any;

let atomId = 0;
const atomState: Record<number, any> = {};
const atomEvents: Record<number, AtomListener<any>[]> = {};

export const uuid = () => atomId++;

export function getState<T>(atom: Atom<T>) {
  return atomState[atom.id] as T;
}

export function setState<T>(atom: Atom<T>, value: T) {
  atomState[atom.id] = value;
}

export function subscribe<T>(atom: Atom<T>, cb: AtomListener<T>) {
  const aid = atom.id;
  if (!atomEvents[atom.id]) {
    atomEvents[aid] = [];
  }
  const events = atomEvents[atom.id];
  if (events.indexOf(cb) === -1) {
    events.push(cb);
  }

  let unsubscribed = false;
  return function unsubscribe() {
    if (unsubscribed) {
      return;
    }
    unsubscribed = true;
    const _events = atomEvents[aid];
    if (_events.length) {
      const i = _events.indexOf(cb);
      if (i !== -1) {
        _events[i] = _events[_events.length - 1];
        _events.length--;
      }
    }
  };
}

export function notify<T>(atom: Atom<T>, cur: T, prev: T) {
  const aid = atom.id;
  const events = atomEvents[aid];
  if (events && events.length) {
    for (let index = 0; index < events.length; index++) {
      events[index](cur, prev);
    }
  }
}
