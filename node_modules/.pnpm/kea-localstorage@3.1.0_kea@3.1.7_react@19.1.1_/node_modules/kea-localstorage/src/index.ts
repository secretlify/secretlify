import {
  reducers,
  getPluginContext,
  KeaPlugin,
  Logic,
  ReducerActions,
  ReducerDefault,
  setPluginContext,
  LogicBuilder,
} from 'kea'

export interface LocalStoragePluginOptions {
  prefix: string
  separator: string
  storageEngine: Storage | undefined
}

let localStorageEngine: Storage | undefined

try {
  localStorageEngine = window.localStorage

  const x = '__storage_test__'
  localStorageEngine.setItem(x, x)
  localStorageEngine.removeItem(x)
} catch (e) {
  localStorageEngine = undefined
}

export type PersistenceOptions = {
  persist?: true
  prefix?: string
  separator?: string
  storageKey?: string
}

export type PersistentReducerDefinitions<L extends Logic> = {
  [K in keyof L['reducers']]?:
    | [
        ReducerDefault<L['reducers'][K], L['props']>,
        PersistenceOptions,
        ReducerActions<L, ReturnType<L['reducers'][K]>>,
      ]
    | [ReducerDefault<L['reducers'][K], L['props']>, ReducerActions<L, ReturnType<L['reducers'][K]>>]
    | [ReducerDefault<L['reducers'][K], L['props']>]
    | ReducerActions<L, ReturnType<L['reducers'][K]>>
}

export const localStoragePlugin = (pluginOptions: Partial<LocalStoragePluginOptions> = {}): KeaPlugin => {
  const prefix = pluginOptions.prefix ?? ''
  const separator = pluginOptions.separator ?? '.'
  const storageEngine = pluginOptions.storageEngine ?? localStorageEngine

  return {
    name: 'localStorage',

    events: {
      afterPlugin() {
        setPluginContext('localStorage', { storageCache: {}, storageEngine, prefix, separator })
      },
      afterLogic(logic, input) {
        for (const [key, reducerOptions] of Object.entries(logic.reducerOptions)) {
          if (reducerOptions?.persist) {
            persistentReducers({ [key]: {} })(logic)
          }
        }
      },
    },
  }
}

export function persistReducer<L extends Logic>(key: keyof L['reducers']): LogicBuilder<L> {
  return (logic) => {
    const key_ = key as string
    const { storageCache, storageEngine, prefix: __prefix, separator: __separator } = getPluginContext('localStorage')
    const prefix = logic.reducerOptions[key_]?.prefix || __prefix
    const separator = logic.reducerOptions[key_]?.separator || __separator
    const storageKey = logic.reducerOptions[key_]?.storageKey || [...logic.path, key].join(separator)
    const path = `${prefix ? prefix + separator : ''}${storageKey}`

    if (!storageEngine) {
      throw new Error(`[KEA] LocalStorage plugin requires a "storageEngine"`)
    }
    if (logic.pathString.indexOf('kea.logic.') === 0) {
      throw new Error('[KEA] Logic must have a unique path to persist reducers')
    }

    logic.cache.localStorage ??= {} as Record<string, boolean>
    logic.cache.localStorageDefaults ??= {}
    logic.cache.localStorageDefaults[key] ??= logic.defaults[key as any] ?? null

    if (typeof storageEngine[path] !== 'undefined') {
      try {
        logic.defaults[key as any] = JSON.parse(storageEngine[path])
      } catch (e) {
        // can't deserialize a value? pretend it never existed
        storageEngine[path] = undefined
      }
    } else {
      storageEngine[path] = logic.defaults[key as any] ?? null
    }
    storageCache[path] = logic.defaults[key as any]

    const reducer = logic.reducers[key as any]
    if (reducer) {
      logic.reducers[key as any] = (state, action) => {
        const result = reducer(state, action)
        if (storageCache[path] !== result) {
          storageCache[path] = result
          storageEngine[path] = JSON.stringify(result)
        }
        return result
      }
    }
  }
}

export function persistentReducers<L extends Logic = Logic>(
  input: PersistentReducerDefinitions<L> | ((logic: L) => PersistentReducerDefinitions<L>),
): LogicBuilder<L> {
  return (logic) => {
    const reducersInput = typeof input === 'function' ? input(logic) : input
    reducers(reducersInput)(logic)
    for (const key of Object.keys(reducersInput)) {
      persistReducer(key)(logic)
    }
  }
}
