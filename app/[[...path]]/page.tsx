import classNames from 'classnames'
import TestRunner from '@/components/test-runner'
import { client } from '@/sanity/lib/client'
import stack from '@/components/stack.css'
import textContainer from '@/components/text-container.css'
import { Mode } from '@/types/state'

interface Props {
  params: {
    path: [testId: string]
  }
}

export default async function Home({ params }: Props) {
  const [testId] = params.path ?? []

  return (
    <main className={classNames([stack({ size: 'large' }), textContainer()])}>
      {/* @ts-expect-error async server component */}
      <Test testId={testId} />
    </main>
  )
}

interface TestProps {
  testId?: string
}

async function Test({ testId }: TestProps) {
  let test: any
  let result: any

  if (testId) {
    test = await client
      .withConfig({
        token: process.env.SANITY_WRITE_API_TOKEN,
      })
      .fetch('*[_type == "test" && _id == $testId][0]', {
        testId,
      })

    await new Promise(resolve => setTimeout(resolve, 5000))
  }

  if (test?.result) {
    result = JSON.parse(test.result)
  }

  const mode = getMode(testId, test)

  return (
    <>
      {mode === 'newTest' && (
        <p>
          Welcome, {test.user.firstName}. This tool will run tests in your
          browser to check whether you&apos;re ready to use Sanity Studio. The
          results will automatically be shared with the Sanity team.
        </p>
      )}
      {mode === 'usedTest' && (
        <p>
          Welcome, {test.user.firstName}. You have already completed the tests,
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
      <TestRunner mode={mode} />
      {mode === 'usedTest' && (
        <p>
          Test results submitted: {new Date(result.finishedAt).toLocaleString()}
        </p>
      )}
    </>
  )
}

function getMode(
  testId: string | undefined,
  test: any | null | undefined,
): Mode {
  if (typeof testId === 'undefined') {
    return 'guest'
  }

  if (test === null) {
    return 'invalidId'
  }

  if (typeof test?.result === 'undefined') {
    return 'newTest'
  }

  return 'usedTest'
}
