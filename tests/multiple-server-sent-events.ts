import { Test } from '../types/test'

import createServerSentEventTest, {
  SuccessMetadata,
  FailureMetadata,
} from './lib/create-server-sent-event-test'

const SSE_URL = 'https://sse-test.deno.dev'
const TARGET_COUNT = 50
const TIMEOUT = 5_000

const multipleServerSentEvents: Test<SuccessMetadata, FailureMetadata> = {
  name: 'Multiple server-sent events',
  version: 1,
  runCount: 1,
  run: createServerSentEventTest(SSE_URL, TARGET_COUNT, TIMEOUT),
}

export default multipleServerSentEvents
