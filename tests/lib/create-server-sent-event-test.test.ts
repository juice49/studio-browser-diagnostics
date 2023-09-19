import { describe, it, expect, vi, beforeAll } from 'vitest'
import createServerSentEventTest, {
  SuccessMetadata,
  FailureMetadata,
} from './create-server-sent-event-test'
import runTest from '../../lib/run-test'
import { Test } from '../../types/test'

beforeAll(async () => {
  // const { unregister, update }

  const serviceWorker = await navigator.serviceWorker.register(
    '/service-worker.mjs',
    {
      scope: '/',
      type: 'module',
    },
  )

  // await serviceWorker.update() // xxx

  // await new Promise(resolve => {
  //   navigator.serviceWorker.addEventListener('controllerchange', resolve)
  // })

  await navigator.serviceWorker.ready

  // await new Promise(resolve => setTimeout(resolve, 10))
  // await new Promise(resolve => requestAnimationFrame(resolve))

  return () => serviceWorker.unregister()
})

describe('createServerSentEventTest', () => {
  it('opens EventSources using the provided URL', async () => {
    const serverSentEventTest: Test<SuccessMetadata, FailureMetadata> = {
      name: 'Test',
      version: 1,
      run: createServerSentEventTest('/mocks/open-event-source', 1, 500),
    }

    const result = await runTest(serverSentEventTest)

    expect((result.metadata as SuccessMetadata).messages[0]).toBe(
      'message from /mocks/open-event-source',
    )
  })

  it('opens the provided number of EventSources simultaneously')

  it('fails if no message is received within the provided timeout duration')

  it('does not close any EventSources until the test is complete')
})
