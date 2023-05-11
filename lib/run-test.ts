import {
  Test,
  TestResult,
  TestResultStatus,
  CleanUpFunction,
  SimpleError,
} from '@/types/test'

type Resolver = (result: TestResult<unknown>) => void

export default function runTest(
  test: Test<unknown>,
): Promise<TestResult<unknown>> {
  return new Promise<TestResult<unknown>>(resolve => {
    const { run } = test
    const onSuccess = createResultHandler('success', test, resolve)
    const onFailure = createResultHandler('failure', test, resolve)
    let cleanUp: CleanUpFunction | undefined

    try {
      run({
        onSuccess: metadata =>
          onSuccess({
            cleanUp,
            metadata,
          }),
        onFailure: metadata =>
          onFailure({
            cleanUp,
            metadata,
          }),
        useCleanUp(value) {
          cleanUp = value
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        onFailure({ cleanUp, error })
      }
    }
  })
}

function createResultHandler(
  status: TestResultStatus,
  { name, version }: Test<unknown>,
  resolve: Resolver,
): (api: {
  cleanUp: CleanUpFunction | undefined
  metadata?: unknown
  error?: Error
}) => void {
  const startedAt = new Date()

  return ({ cleanUp, metadata, error }) => {
    try {
      cleanUp?.()
    } catch (error) {
      console.log('Test clean-up failed.', error)
    }

    resolve({
      name,
      version,
      status,
      startedAt,
      finishedAt: new Date(),
      error: getSimpleError(error),
      metadata,
    })
  }
}

export function getSimpleError(
  error: Error | undefined,
): SimpleError | undefined {
  if (error) {
    return {
      name: error.name,
      message: error.message,
    }
  }
}
