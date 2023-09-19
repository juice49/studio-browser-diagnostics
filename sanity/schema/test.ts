import { defineType, defineField } from 'sanity'
import TestDocumentInput from '../components/test-document-input'

const test = defineType({
  name: 'test',
  title: 'Test',
  type: 'document',
  description: 'An instance of an entire test suite executed by a user.',
  fields: [
    defineField({
      name: 'user',
      title: 'User',
      type: 'object',
      fields: [
        defineField({
          name: 'firstName',
          title: 'First Name',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
        }),
        defineField({
          name: 'organisationName',
          title: 'Organisation',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
    }),
    defineField({
      name: 'result',
      title: 'Result',
      type: 'string',
      // readOnly: true,
    }),
  ],
  components: {
    input: TestDocumentInput,
  },
  preview: {
    select: {
      user: 'user',
      createdAt: '_createdAt',
    },
    prepare({ user, createdAt }) {
      return {
        title: [
          [user.firstName, user.lastName].join(' '),
          typeof createdAt === 'undefined'
            ? ''
            : `(${new Date(createdAt).toLocaleDateString()})`,
        ].join(' '),
        subtitle: user.organisationName,
      }
    },
  },
})

export default test
