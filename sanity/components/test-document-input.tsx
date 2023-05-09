import { ComponentType } from 'react'
import { ObjectInputProps } from 'sanity'
import { Stack } from '@sanity/ui'
import TestStatusCard from './test-status-card'

const TestDocumentInput: ComponentType<ObjectInputProps> = props => (
  <Stack space={4}>
    <TestStatusCard
      id={props.value?._id ?? ''}
      hasResult={typeof props.value?.result !== 'undefined'}
    />
    {props.renderDefault(props)}
  </Stack>
)

export default TestDocumentInput
