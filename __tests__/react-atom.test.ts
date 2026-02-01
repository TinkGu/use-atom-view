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

  describe('Subscription/Unsubscription', () => {
    test('subscribes to atom on mount', () => {
      const atom = Atom.of(0);
      const subscribeSpy = jest.spyOn(atom, 'subscribe');

      renderHook(() => useAtomView(atom));

      expect(subscribeSpy).toHaveBeenCalledTimes(1);
      expect(subscribeSpy).toHaveBeenCalledWith(expect.any(Function));
    });

    test('unsubscribes on unmount', () => {
      const atom = Atom.of(0);
      const unsubscribeSpy = jest.fn();
      jest.spyOn(atom, 'subscribe').mockReturnValue(unsubscribeSpy);

      const { unmount } = renderHook(() => useAtomView(atom));

      expect(unsubscribeSpy).not.toHaveBeenCalled();

      unmount();

      expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    });

    test('subscription function is stable across renders', () => {
      const atom = Atom.of(0);
      const subscribeSpy = jest.spyOn(atom, 'subscribe');

      const { rerender } = renderHook(() => useAtomView(atom));

      expect(subscribeSpy).toHaveBeenCalledTimes(1);

      act(() => {
        atom.set(1);
      });
      rerender();

      expect(subscribeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Re-render behavior', () => {
    test('re-renders when atom.set() changes value', () => {
      const atom = Atom.of(0);
      const renderSpy = jest.fn();

      function TestComponent() {
        renderSpy();
        return useAtomView(atom);
      }

      const { result, rerender } = renderHook(() => TestComponent());

      expect(renderSpy).toHaveBeenCalledTimes(1);

      act(() => {
        atom.set(1);
      });

      expect(result.current).toBe(1);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('re-renders when atom.modify() changes value', () => {
      const atom = Atom.of(0);
      const renderSpy = jest.fn();

      function TestComponent() {
        renderSpy();
        return useAtomView(atom);
      }

      const { result } = renderHook(() => TestComponent());

      const initialRenderCount = renderSpy.mock.calls.length;

      act(() => {
        atom.modify((x: number) => x + 1);
      });

      expect(result.current).toBe(1);
      expect(renderSpy).toHaveBeenCalledTimes(initialRenderCount + 1);
    });

    test('receives notification even if value does not change', () => {
      const atom = Atom.of(0);
      const renderSpy = jest.fn();

      function TestComponent() {
        renderSpy();
        return useAtomView(atom);
      }

      const { result } = renderHook(() => TestComponent());

      const initialRenderCount = renderSpy.mock.calls.length;

      act(() => {
        atom.set(0);
      });

      expect(result.current).toBe(0);
      expect(renderSpy.mock.calls.length).toBeGreaterThan(initialRenderCount);
    });
  });

  describe('Multiple components', () => {
    test('multiple components can subscribe to same atom', () => {
      const atom = Atom.of(0);

      const { result: result1 } = renderHook(() => useAtomView(atom));
      const { result: result2 } = renderHook(() => useAtomView(atom));

      expect(result1.current).toBe(0);
      expect(result2.current).toBe(0);

      act(() => {
        atom.set(5);
      });

      expect(result1.current).toBe(5);
      expect(result2.current).toBe(5);
    });

    test('all components re-render when atom changes', () => {
      const atom = Atom.of(0);
      const renderSpy1 = jest.fn();
      const renderSpy2 = jest.fn();

      function Component1() {
        renderSpy1();
        return useAtomView(atom);
      }

      function Component2() {
        renderSpy2();
        return useAtomView(atom);
      }

      renderHook(() => Component1());
      renderHook(() => Component2());

      expect(renderSpy1).toHaveBeenCalledTimes(1);
      expect(renderSpy2).toHaveBeenCalledTimes(1);

      act(() => {
        atom.set(1);
      });

      expect(renderSpy1).toHaveBeenCalledTimes(2);
      expect(renderSpy2).toHaveBeenCalledTimes(2);
    });

    test('component unmounting does not affect other components', () => {
      const atom = Atom.of(0);

      const { result: result1, unmount: unmount1 } = renderHook(() => useAtomView(atom));
      const { result: result2 } = renderHook(() => useAtomView(atom));

      expect(result1.current).toBe(0);
      expect(result2.current).toBe(0);

      unmount1();

      act(() => {
        atom.set(1);
      });

      expect(result2.current).toBe(1);
    });
  });

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
