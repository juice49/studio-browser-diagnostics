import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { writeClient } from '@/sanity/lib/client'

interface Params {
  testId: string
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const result = await request.text()

  // console.log('[TEST ID]', testId, params)
  // console.log('[BODY]', result)
  // return

  await writeClient.patch(params.testId).set({ result }).commit()

  // TODO: Revalidate specific test path when Next.js supports this.
  // e.g. `/${testId}`.
  revalidatePath('/[[...path]]')
  return NextResponse.json({ foo: 'bar' })
}
