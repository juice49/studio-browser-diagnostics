import { TestRunFunction } from '@/types/test'

export interface SuccessMetadata {
  targetCount: number
  timeout: number
  messages: unknown[]
}

export interface FailureMetadata extends SuccessMetadata {
  count: number
}

export default function createServerSentEventTest(
  url: string,
  targetCount: number,
  timeoutDuration: number,
): TestRunFunction<SuccessMetadata, FailureMetadata> {
  return ({ onSuccess, onFailure, useCleanUp }) => {
    const messages: unknown[] = []
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let successCount = 0
    let failureCount = 0

    const eventSources = Array.from(
      { length: targetCount },
      () => new EventSource(url),
    )

    useCleanUp(() => {
      eventSources.forEach(eventSource => eventSource.close())
      timeouts.forEach(clearTimeout)
    })

    eventSources.forEach(eventSource => {
      const onEvent = () => {
        const isComplete = successCount + failureCount === targetCount
        const isSuccess = isComplete && successCount === targetCount
        const isFailure = isComplete && failureCount > 0

        if (isSuccess) {
          onSuccess({
            targetCount,
            timeout: timeoutDuration,
            messages,
          })
        }

        if (isFailure) {
          onFailure({
            count: successCount,
            targetCount,
            timeout: timeoutDuration,
            messages,
          })
        }
      }

      const onMessage = ({ data }: MessageEvent) => {
        clearTimeout(timeout)
        eventSource.removeEventListener('message', onMessage)
        successCount++
        messages.push(data)
        onEvent()
      }

      eventSource.addEventListener('message', onMessage)

      const timeout = setTimeout(() => {
        failureCount++
        eventSource.removeEventListener('message', onMessage)
        onEvent()
      }, timeoutDuration)

      timeouts.push(timeout)
    })
  }
}
