import { globalStyle } from '@vanilla-extract/css'
import { vars } from './theme.css'

globalStyle(':root', {
  WebkitFontSmoothing: 'antialiased',
  fontSize: 'max(1rem, 0.6vw + 1rem)',
  fontFamily: vars.fonts.sans,
  backgroundColor: 'color(display-p3 0.0314 0.0588 0.0667)',
  color: 'color(display-p3 0.6118 0.6235 0.6275)',
  lineHeight: 1.4,
})

globalStyle('*', {
  margin: 0,
  padding: 0,
})

globalStyle('body', {
  // padding: vars.space[1],
  padding: '5rem',
})
