import { ComponentType } from 'react'
import { Stack, Flex, Card, Spinner, Label, TextInput } from '@sanity/ui'
import { CheckmarkIcon } from '@sanity/icons'

interface Props {
  id: string
  hasResult?: boolean
}

// TODO: Reflect result status.
// TODO: Make URL easy to select and copy.
const TestStatusCard: ComponentType<Props> = ({ id, hasResult }) => {
  return (
    <Card
      tone={hasResult ? 'positive' : 'primary'}
      padding={4}
      radius={2}
      shadow={1}
    >
      <Stack space={4}>
        {!hasResult && (
          <Flex align='center' direction='row' gap={3} height='fill'>
            <Spinner size={1} muted />
            <Label>Test pending</Label>
          </Flex>
        )}
        {hasResult && (
          <Flex align='center' direction='row' gap={2} height='fill'>
            <CheckmarkIcon />
            <Label>Test completed</Label>
          </Flex>
        )}
        {/* TODO: Environment based URL. */}
        <TextInput
          aria-label='Test URL'
          value={`http://localhost:3000/${id}`}
          readOnly
        />
      </Stack>
    </Card>
  )
}

export default TestStatusCard
