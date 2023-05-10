'use client'

import { ComponentType, useState } from 'react'
import runTestSuite from '@/lib/run-test-suite'
import singleServerSentEvent from '@/tests/single-server-sent-event'
import multipleServerSentEvents from '@/tests/multiple-server-sent-events'
import localStorageReadWrite from '@/tests/localstorage-read-write'
import saveResult from '@/app/save-test-result'
import button from '@/components/button.css'
import { Mode } from '@/types/state'

interface Props {
  testId?: string
  mode: Mode
}

const TestRunner: ComponentType<Props> = ({ mode, testId }) => {
  const [state, setState] = useState<'notStarted' | 'running' | 'completed'>(
    'notStarted',
  )

  const [result, setResult] = useState<unknown | undefined>()

  return (
    <>
      <button
        disabled={state !== 'notStarted' || mode === 'usedTest'}
        className={button()}
        onClick={async () => {
          setState('running')

          const result = await runTestSuite([
            singleServerSentEvent,
            multipleServerSentEvents,
            localStorageReadWrite,
          ])

          setResult(result)

          if (testId) {
            try {
              await saveResult(testId, result)
            } catch (error) {
              setState('notStarted')
              return
            }
          }

          setState('completed')
        }}
      >
        {state === 'notStarted' && 'Run tests'}
        {state === 'running' && <>Running&hellip;</>}
        {state === 'completed' && 'Done'}
      </button>
      {typeof result !== 'undefined' && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </>
  )
}

export default TestRunner
