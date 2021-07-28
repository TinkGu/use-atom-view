# use-atom-view

# 快速使用

👇🏻 下面通过一个常见的「计数器」例子来快速了解

```typescript
import React from 'react';
import { Atom, useAtomView } from 'use-atom-view';

interface Counter {
  count: number;
}

const counterAtom = Atom.of<Counter>({ count: 1 });

function CounterBox() {
  const { count } = useAtomView(counterAtom);
  const hanldeAdd = () => {
    counterAtom.modify((x) => ({
      ...x,
      count: x.count + 1,
    }));

    // or
    // counterAtom.set({ count: count + 1 });
  };

  return (
    <div>
      <button onClick={hanldeAdd}>add counter</button>
      <div>{count}</div>
    </div>
  );
}
```
