/* eslint-disable react-hooks/rules-of-hooks */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Test, TestResultStatus, TestResult } from '@/types/test'
import runTest, { getSimpleError } from './run-test'

const succeedingTest: Test = {
  name: 'Succeeding Test',
  version: 1,
  run: ({ onSuccess }) => {
    onSuccess()
  },
}

const failingTest: Test = {
  name: 'Failing Test',
  version: 1,
  run: ({ onFailure }) => {
    onFailure()
  },
}

const erroringTest: Test = {
  name: 'Failing Test',
  version: 1,
  run: () => {
    throw new Error('Test Error')
  },
}

const erroringCleanUp: Test = {
  name: 'Erroring Clean-Up',
  version: 1,
  run: ({ onSuccess, useCleanUp }) => {
    useCleanUp(() => {
      throw new Error('Clean-Up Error')
    })

    onSuccess()
  },
}

describe('runTest', () => {
  it('resolves with "success" status when test succeeds', async () => {
    const { status } = await runTest(succeedingTest)
    expect(status).toBe<TestResultStatus>('success')
  })

  it('resolves with "failure" status when test fails', async () => {
    const { status } = await runTest(failingTest)
    expect(status).toBe<TestResultStatus>('failure')
  })

  it('catches errors during test execution and resolves with "failure" status', async () => {
    const { status } = await runTest(erroringTest)
    expect(status).toBe<TestResultStatus>('failure')
  })

  it('calls clean-up function after test finishes', async () => {
    let succeedingTestCleanUpCalled: boolean = false
    let failingTestCleanUpCalled: boolean = false

    const succeedingTest: Test = {
      name: 'Succeeding Test',
      version: 1,
      run: ({ onSuccess, useCleanUp }) => {
        useCleanUp(() => {
          succeedingTestCleanUpCalled = true
        })
        onSuccess()
      },
    }

    const failingTest: Test = {
      name: 'Failing Test',
      version: 1,
      run: ({ onFailure, useCleanUp }) => {
        useCleanUp(() => {
          failingTestCleanUpCalled = true
        })
        onFailure()
      },
    }

    await Promise.all([runTest(succeedingTest), runTest(failingTest)])

    expect(succeedingTestCleanUpCalled).toBe(true)
    expect(failingTestCleanUpCalled).toBe(true)
  })

  it('catches errors during test clean-up', async () => {
    const { status } = await runTest(erroringCleanUp)
    expect(status).toBe<TestResultStatus>('success')
  })

  it('resolves with the expected data', async () => {
    const now = new Date()
    const later = new Date()
    const testError = new Error('Test error')

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(now)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    const succeedingTest: Test = {
      name: 'Succeeding Test',
      version: 1,
      run: ({ onSuccess }) => {
        vi.setSystemTime(later)
        onSuccess()
      },
    }

    const failingTest: Test = {
      name: 'Failing Test',
      version: 1,
      run: ({ onFailure }) => {
        vi.setSystemTime(later)
        onFailure()
      },
    }

    const erroringTest: Test = {
      name: 'Erroring Test',
      version: 1,
      run: () => {
        vi.setSystemTime(later)
        throw testError
      },
    }

    const [succeedingTestData, failingTestData, erroringTestData] =
      await Promise.all([
        runTest(succeedingTest),
        runTest(failingTest),
        runTest(erroringTest),
      ])

    expect(succeedingTestData).toEqual<TestResult>({
      name: 'Succeeding Test',
      version: 1,
      status: 'success',
      startedAt: now,
      finishedAt: later,
      error: undefined,
      metadata: undefined,
    })

    expect(failingTestData).toEqual<TestResult>({
      name: 'Failing Test',
      version: 1,
      status: 'failure',
      startedAt: now,
      finishedAt: later,
      error: undefined,
      metadata: undefined,
    })

    expect(erroringTestData).toEqual<TestResult>({
      name: 'Erroring Test',
      version: 1,
      status: 'failure',
      startedAt: now,
      finishedAt: later,
      error: getSimpleError(testError),
      metadata: undefined,
    })
  })

  it('resolves with the expected metadata', async () => {
    interface SuccessMetadata {
      successMessage: 'success'
    }

    interface FailureMetadata {
      failureMessage: 'fail'
    }

    const succeedingTest: Test<SuccessMetadata, FailureMetadata> = {
      name: 'Succeeding Test',
      version: 1,
      run: ({ onSuccess }) => {
        onSuccess({
          successMessage: 'success',
        })
      },
    }

    const failingTest: Test<SuccessMetadata, FailureMetadata> = {
      name: 'Failing Test',
      version: 1,
      run: ({ onFailure }) => {
        onFailure({
          failureMessage: 'fail',
        })
      },
    }

    const [succeedingTestData, failingTestData] = await Promise.all([
      runTest(succeedingTest),
      runTest(failingTest),
    ])

    expect(succeedingTestData.metadata).toEqual<SuccessMetadata>({
      successMessage: 'success',
    })

    expect(failingTestData.metadata).toEqual<FailureMetadata>({
      failureMessage: 'fail',
    })
  })
})
