export const metadata = {
  title: 'Lavia',
  description: 'Encuentra lavacarros independientes cerca de ti',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: '20px', background: '#eef6f8' }}>
        {children}
      </body>
    </html>
  )
}
