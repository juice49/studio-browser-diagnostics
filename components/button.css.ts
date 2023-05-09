import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/app/theme.css'

const button = recipe({
  base: {
    paddingInline: vars.space[1],
    paddingBlock: `calc(${vars.space[1]} * 0.5)`,
    appearance: 'none',
    border: 'none',
    borderRadius: 2,
    backgroundColor: 'green',
    color: '#fff',
    cursor: 'pointer',
    fontFamily: vars.fonts.mono,
    fontSize: '0.8rem',
    ':disabled': {
      backgroundColor: 'grey',
      cursor: 'not-allowed',
    },
  },
})

export default button
