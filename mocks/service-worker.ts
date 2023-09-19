/// <reference no-default-lib="true"/>
/// <reference lib="WebWorker" />
// @ts-ignore
const handlers = import.meta.glob('./handlers/*.ts', {
  eager: true,
})

const sw = self as ServiceWorkerGlobalScope & typeof globalThis

sw.addEventListener('activate', sw.clients.claim)
sw.addEventListener('install', sw.skipWaiting)

sw.addEventListener('fetch', event => {
  const { headers, url } = event.request
  const isEventStream = headers.get('Accept') === 'text/event-stream'

  if (!isEventStream) {
    return
  }

  const { pathname } = new URL(url)
  const handlerName = pathname.replace('/mocks/', './handlers/') + '.ts'
  const { default: handler } = handlers[handlerName]

  handler?.(event)

  // if (typeof handler === 'function') {
  //   handler(event)
  // }
})
