import { useReducer, useLayoutEffect } from 'react';
import { Atom, view, subscribe } from './Atom';

export function useAtomView<T>(atom: Atom<T>) {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  const state = view(atom);

  useLayoutEffect(() => {
    return subscribe(atom, forceUpdate);
  }, [atom]);

  return state;
}
