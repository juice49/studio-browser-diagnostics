import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Test, TestResult } from '@/types/test'
import runTestSuite from './run-test-suite'

beforeEach(() => {
  vi.useFakeTimers({
    shouldAdvanceTime: true,
  })

  return vi.useRealTimers
})

describe('runTestSuite', () => {
  it('executes tests serially', async () => {
    const result = await runTestSuite([
      {
        name: 'a',
        version: 1,
        run: ({ onFailure }) => {
          setTimeout(onFailure, 600)
        },
      },
      {
        name: 'b',
        version: 1,
        run: ({ onSuccess }) => {
          setTimeout(onSuccess, 200)
        },
      },
      {
        name: 'c',
        version: 1,
        run: () => {
          throw new Error()
        },
      },
    ])

    const testResultNames = result.testResults.map(({ name }) => name)
    expect(testResultNames).toEqual(['a', 'b', 'c'])
  })

  it('resolves with the expected data', async () => {
    const now = new Date()
    const later = new Date()

    later.setHours(now.getHours() + 1)

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

    vi.setSystemTime(now)

    const succeedingTestResult = await runTestSuite([succeedingTest])

    expect(succeedingTestResult.version).toBeTypeOf('number')
    expect(succeedingTestResult.userAgent).toBeTypeOf('string')
    expect(succeedingTestResult.startedAt).toEqual(now)
    expect(succeedingTestResult.finishedAt).toEqual(later)

    expect(succeedingTestResult.testResults).toEqual<TestResult[]>([
      {
        name: 'Succeeding Test',
        version: 1,
        status: 'success',
        startedAt: now,
        finishedAt: later,
        error: undefined,
        metadata: undefined,
      },
    ])

    vi.setSystemTime(now)

    const failingTestResult = await runTestSuite([failingTest])

    expect(failingTestResult.version).toBeTypeOf('number')
    expect(failingTestResult.userAgent).toBeTypeOf('string')
    expect(failingTestResult.startedAt).toEqual(now)
    expect(failingTestResult.finishedAt).toEqual(later)

    expect(failingTestResult.testResults).toEqual<TestResult[]>([
      {
        name: 'Failing Test',
        version: 1,
        status: 'failure',
        startedAt: now,
        finishedAt: later,
        error: undefined,
        metadata: undefined,
      },
    ])
  })
})
