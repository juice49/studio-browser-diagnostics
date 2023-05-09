import { Test } from '../types/test'

const KEY = 'testKey123'
const VALUE = 'testValue123'

const localStorageReadWrite: Test = {
  name: 'localStorage Read Write',
  version: 1,
  runCount: 1,
  run: ({ onSuccess, onFailure, useCleanUp }) => {
    useCleanUp(() => localStorage.removeItem(KEY))

    localStorage.setItem(KEY, VALUE)

    if (localStorage.getItem(KEY) === VALUE) {
      onSuccess()
      return
    }

    onFailure()
  },
}

export default localStorageReadWrite
