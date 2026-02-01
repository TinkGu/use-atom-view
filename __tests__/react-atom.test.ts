import { useEffect } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import TestRenderer from 'react-test-renderer';
import { Atom, useAtomView } from 'use-atom-view';

const { act } = TestRenderer;

describe('useAtomView - useSyncExternalStore integration', () => {
  describe('Basic functionality', () => {
    test('returns current atom value', () => {
      const atom = Atom.of(42);
      const { result } = renderHook(() => useAtomView(atom));

      expect(result.current).toBe(42);
    });

    test('updates when atom.set() is called', () => {
      const atom = Atom.of(0);
      const { result } = renderHook(() => useAtomView(atom));

      expect(result.current).toBe(0);

      act(() => {
        atom.set(10);
      });

      expect(result.current).toBe(10);
    });

    test('updates when atom.modify() is called', () => {
      const atom = Atom.of(5);
      const { result } = renderHook(() => useAtomView(atom));

      expect(result.current).toBe(5);

      act(() => {
        atom.modify((x: number) => x * 2);
      });

      expect(result.current).toBe(10);
    });
  });

  describe('Subscription/Unsubscription', () => {});

  describe('Re-render behavior', () => {});

  describe('Multiple components', () => {});

  describe('Atom operations', () => {});

  describe('Fallback implementation', () => {});

  describe('Edge cases', () => {});
});

export const testFallbackImplementation = (testFn: () => void) => {
  const originalImpl = (useEffect as any).useSyncExternalStore;
  (useEffect as any).useSyncExternalStore = undefined;

  try {
    testFn();
  } finally {
    (useEffect as any).useSyncExternalStore = originalImpl;
  }
};
