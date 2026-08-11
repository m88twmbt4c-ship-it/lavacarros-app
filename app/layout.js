export const metadata = {
  title: 'Lavacarros a domicilio',
  description: 'Encuentra lavacarros independientes cerca de ti',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: '20px', background: '#f7f7f5' }}>
        {children}
      </body>
    </html>
  )
}
