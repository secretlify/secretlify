![NPM Version](https://img.shields.io/npm/v/kea-thunk.svg)

Perstist Kea reducers in localstorage

* kea-localstorage 1.1 works with kea 2.4+
* kea-localstorage 1.0 works with kea 1.0+
* kea-localstorage 0.1 works with kea 0.27+

[Read the documentation for Kea](https://kea.js.org/docs/plugins/localstorage)

# Installation

Install via yarn or npm

```sh
yarn add kea-localstorage
npm install --save kea-localstorage
```

Then add it to the context:

```js
import { localStoragePlugin } from 'kea-localstorage'
import { resetContext } from 'kea'

resetContext({
  plugins: [ localStoragePlugin ]
})
```

# Usage

To use it, make sure your logic store has a defined `path`. Then just pass `{ persist: true }` as an option to your reducer, like so:

```js
const someLogic = kea({
  path: () => ['scenes', 'something', 'foobar'], // NEEDED!

  actions: () => ({
    change: value => ({ value })
  }),

  reducers: ({ actions }) => ({
    persistedValue: [0, PropTypes.number, { persist: true }, {
      [actions.change]: (_, payload) => payload.value
    }]
  })
})
```

# Options

You may optionally configure the plugin by passing in some options:

```js
import { localStoragePlugin } from 'kea-localstorage'
import { resetContext } from 'kea'

resetContext({
  plugins: [
    localStoragePlugin({
      // in case you want to replace this, e.g. for tests or non browser environments
      storageEngine: window.localStorage,

      // added before all paths in localStorage's keys
      prefix: 'example',

      // to change the symbol that concats path parts
      separator: '_'
    })
  ]
})
```

With the above configuration all persisted reducers will now be save in the path: `example_scenes_something_foobar`

### To use a different prefix/separator locally for specific reducers

```js
const someLogic = kea([
  path(['scenes', 'something', 'foobar']),

  reducers({
    persistedValue: [0, { persist: true, prefix: 'example', separator: '_' }, {
      changeThing: (_, payload) => payload.value
    }]
  }),
])
```

Now the `persistedValue` will not be saved in `scenes.something.foobar`, but in `example_scenes_something_foobar`

### Get the original default of the reducer

Under the hood `kea-localstorage` overrides the `defaults` value for your reducer with whatever was
stored in localstorage. In case you need to access the original default, it's stored here:

```javascript
logic.cache.localStorageDefaults['reducerKey']
```

### `storageKey`

Pass a `storageKey`, to override the key used for storage. This allows multiple logics to share the same value. For example
to have all keyed logics store a reducer globally.

```js
const someLogic = kea([
  key(props => props.key), // not used for localstorage, overridden by storageKey
  reducers(({ actions }) => ({
    persistedValue: [0, { persist: true, storageKey: 'my.global.key' }, {
      [actions.change]: (_, payload) => payload.value
    }]
  }))
])
```