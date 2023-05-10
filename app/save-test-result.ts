'use server'

import { revalidatePath } from 'next/cache'
import { writeClient } from '@/sanity/lib/client'
import { TestSuiteResult } from '@/types/test'

export default async function saveTestResult(
  testId: string,
  result: TestSuiteResult,
) {
  console.log('[PRE WRITE]', testId)

  try {
    await writeClient
      .patch(testId)
      .set({
        result: JSON.stringify(result),
      })
      .commit()

    console.log('[SUCCEEDED TO WRITE]')
  } catch (error) {
    console.log('[FAILED TO WRITE]', error)
  }

  revalidatePath(testId)
}
