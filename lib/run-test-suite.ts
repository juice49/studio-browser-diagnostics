import { Test, TestSuiteResult } from '@/types/test'
import runTest from './run-test'

export default async function runTestSuite(
  tests: Test<unknown>[],
): Promise<TestSuiteResult> {
  const testResults = []
  const startedAt = new Date()

  for (const test of tests) {
    testResults.push(await runTest(test))
  }

  return {
    version: 1,
    userAgent: navigator.userAgent,
    startedAt,
    finishedAt: new Date(),
    testResults,
  }
}
