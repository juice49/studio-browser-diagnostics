export default (event: FetchEvent) => {
  //let interval

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      //interval = setInterval(() => {
      const message = `data: message from /mocks/open-event-source\n\n`
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode(message))
      controller.close()
      //}, 100)
      // controller.close()
    },
    cancel() {
      // clearInterval(interval)
    },
  })

  const response = new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })

  event.respondWith(response)
}
