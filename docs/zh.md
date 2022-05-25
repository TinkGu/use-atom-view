# use-atom-view

借助响应式数据源 `Atom` 来管理您的应用状态数据。

- 类型友好
- 轻量化
- API 简单

# 快速使用

👇🏻 下面通过一个常见的「计数器」例子来快速了解 `use-atom-view`

```typescript
import React from 'react';
import { Atom, useAtomView } from 'use-atom-view';

// 创建一个 Atom 对象
const counterAtom = Atom.of<number>(1);

function CounterBox() {
  const count = useAtomView(counterAtom);
  // 修改 atom 对象的值，组件会自动响应变更，重新渲染
  const hanldeAdd = () => {
    counterAtom.modify((x) => x + 1);

    // or
    // counterAtom.set(count + 1);
  };

  return (
    <div>
      <button onClick={hanldeAdd}>add counter</button>
      <div>{count}</div>
    </div>
  );
}
```

# Atom

`Atom<T>` 是一个持有了一个不可变值的数据单元，用户可以通过订阅它内部的数据变化，来实现响应式操作。

## Atom.of

创建一个 atom 对象

```typescript
const counter = Atom.of<number>(1);
const motto = Atom.of('水能载舟，亦可赛艇');
const chairman = Atom.of<Person>({ name: 'jiang', birthday: '1926-08-17' });
```

## atom.get

获取 atom 对象中的值

```typescript
const counter = Atom.of<number>(1);
const count = counter.get(); // 1
```

## atom.set

替换 atom 对象中的值

```typescript
const counter = Atom.of<number>(1);
counter.set(2);
counter.get(); // 2
```

## atom.modify

替换 atom 对象中的值，和 `set` 的区别在于，通过传入一个变更函数，在当前值的基础上，返回新值

```typescript
const counter = Atom.of<number>(1);
counter.modify((x) => x + 2);
counter.get(); // 3
```

## atom.merge

以 merge 的形式替换 atom 中的值

```typescript
const a1 = Atom.of({ a: 1, b: 2 });
a1.merge({ b: 3 });
a1.get(); // { a: 1, b: 3 }

// 对于值是 number 类型的 atom，调用结果和 `atom.set` 一样
const counter = Atom.of<number>(1);
counter.merge(2);
counter.get(); // 2
```

## atom.subscribe

监听 atom 数据变化，执行传入的监听回调

```typescript
const counter = Atom.of<number>(1);

counter.subscibe((currentData, prevData) => {
  console.log('atom changed:', currentData, prevData);
});

counter.set(2); // atom changed:, 2, 1
counter.modify((x) => x + 2); // atom changed: 4, 2
```

# 其它框架

- focal
  `use-atom-view` 的灵感源自于 [focal](https://github.com/grammarly/focal)
- jotai
  同样基于 Atom 概念实现的状态管理工具，但 jotai 的理念更偏向 react，无法在 hook 以外读取或操作 atom
