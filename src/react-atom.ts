import { useReducer, useLayoutEffect, useEffect, useMemo } from 'react';
import { Atom } from './atom';
import { view } from './operators';

function useSyncExternalStoreFallback<T>(subscribe: (callback: () => void) => () => void, getSnapshot: () => T): T {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  const snapshot = getSnapshot();

  useLayoutEffect(() => {
    return subscribe(forceUpdate);
  }, [subscribe]);

  return snapshot;
}

const useSyncExternalStoreImpl: <T>(subscribe: (callback: () => void) => () => void, getSnapshot: () => T) => T =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof (useEffect as any).useSyncExternalStore === 'function'
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (useEffect as any).useSyncExternalStore
    : useSyncExternalStoreFallback;

export function useAtomView<T>(atom: Atom<T>) {
  const state = useSyncExternalStoreImpl(
    useMemo(() => {
      return (callback: () => void) => atom.subscribe(callback);
    }, [atom]),
    () => view(atom),
  );

  return state;
}
