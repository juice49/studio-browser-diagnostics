import { Test } from '../types/test'

const KEY = 'testKey123'
const VALUE = 'testValue123'

const localStorageReadWrite: Test = {
  name: 'localStorage Read Write',
  version: 1,
  runCount: 1,
  run: ({ onSuccess, onFailure, useCleanUp }) => {
    // @ts-ignore
    useCleanUp(() => localStorage.removeItem(KEY))

    // @ts-ignore
    localStorage.setItem(KEY, VALUE)

    // @ts-ignore
    if (localStorage.getItem(KEY) === VALUE) {
      onSuccess()
      return
    }

    onFailure()
  },
}

export default localStorageReadWrite
