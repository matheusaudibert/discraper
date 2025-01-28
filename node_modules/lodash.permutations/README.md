# lodash.permutations

`_.permutations(collection, n)`

Calculates all possible permutations of a certain size.

| argument | description |
| ---: | :--- |
| `collection` | A collection of distinct values to calculate the permutations from. |
| `n` | The number of values to combine. |

Returns a new array.

## setup

### npm

```shell
npm i lodash.permutations
```

### ES module

```javascript
import 'lodash.permutations';
import _ from 'lodash';
```

### Node

```javascript
require('lodash.permutations');
let _ = require('lodash');
```

### browser

```html
<script src="https://unpkg.com/lodash"></script>
<script src="https://unpkg.com/lodash.permutations"></script>
```

## usage

```javascript
let permutations = _.permutations([true, {a: 1}, null], 2);
// => [[true, {a: 1}], [true, null], [{a: 1}, true], [{a: 1}, null], [null, true], [null, {a: 1}]]
```

---

Calculate all possible permutations of all possible sizes.

```javascript
let permutations = _.flatMap([2, 4, 6], (v, i, a) => _.permutations(a, i + 1));
// => [[2], [4], [6], [2, 4], [2, 6], [4, 2], [4, 6], [6, 2], [6, 4], [2, 4, 6], [2, 6, 4], [4, 2, 6], [4, 6, 2], [6, 2, 4], [6, 4, 2]]
```

---

Also accepts array-like values.

```javascript
let permutations = _('abc').permutations(3).map(v => _.join(v, '')).value();
// => ['abc', 'acb', 'bac', 'bca', 'cab', 'cba']
```

## see also

- [lodash.combinations](https://github.com/SeregPie/lodash.combinations)
- [lodash.multicombinations](https://github.com/SeregPie/lodash.multicombinations)
- [lodash.multipermutations](https://github.com/SeregPie/lodash.multipermutations)
- [lodash.product](https://github.com/SeregPie/lodash.product)
