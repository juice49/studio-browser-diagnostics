import { createTheme } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
  colors: {},
  space: {
    1: '1rem',
  },
  fonts: {
    sans: 'system-ui, sans-serif',
    mono: `ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas,
    'DejaVu Sans Mono', monospace`,
  },
})
