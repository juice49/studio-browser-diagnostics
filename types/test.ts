export type CleanUpFunction = () => void

export type TestRunFunction<
  ResultMetadata = undefined,
  FailureResultMetadata = ResultMetadata,
> = (api: {
  onSuccess: (metadata?: ResultMetadata) => void
  onFailure: (metadata?: FailureResultMetadata) => void
  useCleanUp: (cleanUp: CleanUpFunction) => void
}) => void

export interface Test<
  ResultMetadata = undefined,
  FailureResultMetadata = ResultMetadata,
> {
  name: string
  version: number
  run: TestRunFunction<ResultMetadata, FailureResultMetadata>
  runCount?: number
  runParallel?: boolean
}

export type SimpleError = Pick<Error, 'name' | 'message'>

export type TestResultStatus = 'success' | 'failure'

export interface Timestamps {
  startedAt: Date
  finishedAt: Date
}

export interface TestResult<ResultMetadata = undefined>
  extends Pick<Test<ResultMetadata>, 'name' | 'version'>,
    Timestamps {
  status: TestResultStatus
  error?: SimpleError
  metadata: ResultMetadata
}

export interface TestSuiteResult extends Timestamps {
  version: number
  testResults: TestResult<unknown>[]
  userAgent: string
}
