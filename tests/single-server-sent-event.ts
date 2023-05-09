import { Test } from '../types/test'

import createServerSentEventTest, {
  SuccessMetadata,
  FailureMetadata,
} from './lib/create-server-sent-event-test'

const SSE_URL = 'https://sse-test.deno.dev'
const TIMEOUT = 5_000

const singleServerSentEvent: Test<SuccessMetadata, FailureMetadata> = {
  name: 'Single server-sent event',
  version: 1,
  runCount: 1,
  run: createServerSentEventTest(SSE_URL, 1, TIMEOUT),
}

export default singleServerSentEvent
