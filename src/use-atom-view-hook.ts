import { useReducer, useLayoutEffect } from 'react';
import { Atom } from './atom';
import { view, subscribe } from './operators';

export function useAtomView<T>(atom: Atom<T>) {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  const state = view(atom);

  useLayoutEffect(() => {
    return subscribe(atom, forceUpdate);
  }, [atom]);

  return state;
}
