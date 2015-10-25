toroidal
========
Helpers for working w/ 2d toroidal (wrap-around) arrays.

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

##### `insert :: (data, x, y, newData) => newData`

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

`f :: (value, x, y) => newValue`

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

##### `zeroes :: (width, height) => data`

```js
torodial.zeroes(3, 2) // [[0, 0, 0],
                      //  [0, 0, 0]]

```

Chaining
--------
`subset`, `insert`, `map` & `reduce` are chainable:

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
