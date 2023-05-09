import { recipe } from '@vanilla-extract/recipes'
import recipeGlobalStyle from '@/lib/recipe-global-style'

const stack = recipe({
  variants: {
    size: {
      large: {},
    },
  },
})

recipeGlobalStyle(stack({ size: 'large' }), '> * + *', {
  marginBlockStart: '1.6em',
})

export default stack
