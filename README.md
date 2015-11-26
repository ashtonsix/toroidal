toroidal
========
Helpers for working w/ 2d toroidal (wrap-around) arrays.

`npm i toroidal`

API
---
##### `subset :: (data, x, y, width, height) => newData`

```js
toroidal.subset([
  [10, 11, 12], // [[10, 11],
  [20, 21, 22], //  [20, 21]]
  [30, 31, 32],
], 0, 0, 2, 2)
```

##### `insert :: (data, x, y, newData, f) => newData`

`f :: (newValue, value, x, y, data) => newValue`

```js
toroidal.insert([
  [10, 11, 12], // [[40, 50, 22],
  [20, 21, 22], //  [60, 70, 32],
  [30, 31, 32], //  [40, 41, 42]]
], 0, 0, [
  [40, 50],
  [60, 70]
])
```

##### `map :: (data, f) => newData`

`f :: (value, x, y, data) => newValue`

```js
toroidal.map([
  [10, 11, 12], // [[20, 21, 22],
  [20, 21, 22], //  [30, 31, 32],
  [30, 31, 32], //  [40, 41, 42]]
], v => v + 10)
```

##### `reduce :: (data, f, initialValue) => result`

`f :: (previousValue, value, x, y, data) => newValue`

```js
toroidal.map([
  [10, 11, 12],
  [20, 21, 22],
  [30, 31, 32],
], (pv, v) => (
  v > 21 ? pv + 1 : pv
), 0) // 4
```

##### `zeroes :: (width, height, f) => data`

`f :: (x, y) => value`

```js
torodial.zeroes(3, 2) // [[0, 0, 0],
                      //  [0, 0, 0]]

torodial.zeroes(3, 2, () => 1) // [[1, 1, 1],
                               //  [1, 1, 1]]

```

Chaining
--------
All functions are chainable:

```js
torodial([
  [10, 11, 12],
  [20, 21, 22],
  [30, 31, 32],
]).subset(0, 0, 2, 2).map(
  v => v + 50
).value(); // [[60, 61],
           //  [70, 71]]
```

Data is passed in automaticaly for chained functions.

You can pass either raw or wrapped data for standalone functions.

Cellular Automata
-----------------
Any life or generations automata can be implemented trivially w/ `toroidal`:

```js
const ok = (str, v) => str.indexOf(v) !== -1;

const automata = ruleset => {
  const [stayAlive, born, numStates = 2] = ruleset.split('/');
  return previousState => (
    toroidal(previousState).map((state, x, y) =>
      state >= 1 && numStates > 2 ? (state + 1) % numStates :
      ok(
        state === 1 ? stayAlive : born,
        toroidal(previousState)
          .subset(x - 1, y - 1, 3, 3)
          .reduce((pv, v) => pv + (v === 1 ? 1 : 0), 0)
          - (state === 1 ? 1 : 0)
      ) ? 1 : 0
    ).value()
  );
};

const gameOfLife = automata('23/3');
const briansBrain = automata('/2/3');
```

More info about [generations](http://psoup.math.wisc.edu/mcell/rullex_gene.html) & [life](http://psoup.math.wisc.edu/mcell/rullex_life.html).
