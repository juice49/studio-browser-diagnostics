import classNames from 'classnames'
import TestRunner from '@/components/test-runner'
import { writeClient } from '@/sanity/lib/client'
import stack from '@/components/stack.css'
import textContainer from '@/components/text-container.css'
import { Mode } from '@/types/state'
import { TestSuiteResult } from '@/types/test'

interface Props {
  params: {
    path: [testId: string]
  }
}

export default async function Home({ params }: Props) {
  const [testId] = params.path ?? []

  return (
    <main className={classNames([stack({ size: 'large' }), textContainer()])}>
      <p>generated at: {Date.now()}</p>
      {/* @ts-expect-error async server component */}
      <Test testId={testId} />
    </main>
  )
}

export const revalidate = 3600

interface TestData {
  user: {
    firstName: string
  }
  result: string
}

interface TestProps {
  testId?: string
}

async function Test({ testId }: TestProps) {
  const { test, result } = await fetchTest(testId)
  const mode = getMode(testId, { test, result })

  return (
    <>
      {mode === 'newTest' && (
        <p>
          Welcome, {test?.user.firstName}. This tool will run tests in your
          browser to check whether you&apos;re ready to use Sanity Studio. The
          results will automatically be shared with the Sanity team.
        </p>
      )}
      {mode === 'usedTest' && (
        <p>
          Welcome, {test?.user.firstName}. You have already completed the tests,
          and the results have been shared with the Sanity team.
        </p>
      )}
      {mode === 'guest' && (
        <p>
          This tool will run tests in your browser to check whether you&apos;re
          ready to use Sanity Studio.
        </p>
      )}
      {mode === 'invalidId' && (
        <p>
          This test link is invalid. You can still run the tests, but the
          results will not automatically be shared with the Sanity team.
        </p>
      )}
      <TestRunner testId={testId} mode={mode} />
      {mode === 'usedTest' && (
        <p>
          Test results submitted:{' '}
          {new Date(result?.finishedAt ?? 0).toLocaleString()}
        </p>
      )}
    </>
  )
}

function getMode(
  testId: string | undefined,
  { test, result }: TestWithResult,
): Mode {
  if (typeof testId === 'undefined') {
    return 'guest'
  }

  if (test === null) {
    return 'invalidId'
  }

  if (result === null) {
    return 'newTest'
  }

  return 'usedTest'
}

interface TestWithResult {
  test: TestData | null
  result: TestSuiteResult | null
}

async function fetchTest(testId: string | undefined): Promise<TestWithResult> {
  if (typeof testId === 'undefined') {
    return {
      test: null,
      result: null,
    }
  }

  const test = await writeClient.fetch<TestData>(
    `
    *[_type == "test" && _id == $testId][0] {
      user {
        firstName
      },
      result
    }
  `,
    {
      testId,
    },
  )

  return {
    test,
    result:
      typeof test?.result !== 'undefined' ? JSON.parse(test.result) : null,
  }
}
