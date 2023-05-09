'use server'

import { writeClient } from '@/sanity/lib/client'
import { TestSuiteResult } from '@/types/test'

export default async function saveTestResult(
  testId: string,
  result: TestSuiteResult,
) {
  await writeClient
    .patch(testId)
    .set({
      result: JSON.stringify(result),
    })
    .commit()
}
