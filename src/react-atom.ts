import { useReducer, useLayoutEffect } from 'react';
import { Atom } from './atom';
import { view } from './operators';

export function useAtomView<T>(atom: Atom<T>) {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  const state = view(atom);

  useLayoutEffect(() => {
    return atom.subscribe(forceUpdate);
  }, [atom]);

  return state;
}
