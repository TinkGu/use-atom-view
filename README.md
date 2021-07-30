# use-atom-view

[中文文档](./docs/zh.md)

Represent the state as an immutable and observable data object by `Atom`.

- TypeScript friendly
- super small, bundle size only 1.5K, gzip 710B
- minimalistic API

# Install

```
npm i -S use-atom-view
```

# Quick Start

👇🏻 Here's a typical example of a 'counter' and how it fits within the whole application

```typescript
import React from 'react';
import { Atom, useAtomView } from 'use-atom-view';

// create an Atom, an atom stores the state data, and an observable object.
const counterAtom = Atom.of<number>(1);

function CounterBox() {
  const count = useAtomView(counterAtom);

  // modify or set the atom value, it will notify the component to re-render,
  // the component will get the next value
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

`Atom<T>` is a data cell that holds a single immutable value, which you can read and write to.

## Atom.of

Create an atom

```typescript
const counter = Atom.of<number>(1);
const motto = Atom.of('too young, too simple');
const chairman = Atom.of<Person>({ name: 'jiang', birthday: '1926-08-17' });
```

## atom.get

read the value in the atom

```typescript
const counter = Atom.of<number>(1);
const count = counter.get(); // 1
```

## atom.set

swap the value in the atom

```typescript
const counter = Atom.of<number>(1);
counter.set(2);
counter.get(); // 2
```

## atom.modify

modify the value in the atom by the setter.

```typescript
const counter = Atom.of<number>(1);
counter.modify((x) => x + 2);
counter.get(); // 3
```

## atom.subscribe

You can track changes that happen to an atom's value with `subscribe`.

```typescript
const counter = Atom.of<number>(1);

counter.subscibe((currentData, prevData) => {
  console.log('atom changed:', currentData, prevData);
});

counter.set(2); // atom changed:, 2, 1
counter.modify((x) => x + 2); // atom changed: 4, 2
```

# Alterntive

- [focal](https://github.com/grammarly/focal)<br/>
  `use-atom-view` inspired form focal

- [jotai](https://github.com/pmndrs/jotai)<br/>
  yet another Atom based state management toolkit. jotai maybe more like React, you cannot read or set atom outside the component
