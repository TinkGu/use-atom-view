import { AtomListener } from './types';

let atomId = 0;
const atomState: Record<number, any> = {};
const atomEvents: Record<number, AtomListener<any>[]> = {};

export const uuid = () => atomId++;

export function getState<T>(id: number) {
  return atomState[id] as T;
}

export function setState<T>(id: number, value: T) {
  atomState[id] = value;
}

export function subscribe<T>(id: number, cb: AtomListener<T>) {
  if (!atomEvents[id]) {
    atomEvents[id] = [];
  }
  const events = atomEvents[id];
  if (events.indexOf(cb) === -1) {
    events.push(cb);
  }

  let unsubscribed = false;
  return function unsubscribe() {
    if (unsubscribed) {
      return;
    }
    unsubscribed = true;
    const _events = atomEvents[id];
    if (_events.length) {
      const i = _events.indexOf(cb);
      if (i !== -1) {
        _events[i] = _events[_events.length - 1];
        _events.length--;
      }
    }
  };
}

export function notify<T>(id: number, cur: T, prev: T) {
  const events = atomEvents[id];
  if (events && events.length) {
    for (let index = 0; index < events.length; index++) {
      events[index](cur, prev);
    }
  }
}
