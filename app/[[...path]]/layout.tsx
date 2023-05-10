import { themeClass } from '../theme.css'
import { PlugIcon } from '@sanity/icons'
import '../global.css'
import stack from '@/components/stack.css'

export const metadata = {
  title: 'Studio Browser Diagnostics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={themeClass}>
      <body className={stack({ size: 'large' })}>
        <header>
          <p>generated at: {Date.now()}</p>
          <PlugIcon fontSize={50} />
          <h1>Studio Browser Diagnostics</h1>
        </header>
        {children}
      </body>
    </html>
  )
}
