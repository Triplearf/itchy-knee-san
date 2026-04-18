import "./globals.css"
import { Outfit } from 'next/font/google'
import Navbar from '../components/Navbar'
import InteractiveBackground from '../components/InteractiveBackground'

const nunito = Outfit({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export default function RootLayout({children,}:
  {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <main className={`min-h-screen w-full ${nunito.variable} font-sans`}>
          {children}
        </main>
      </body>
    </html>)
}

export const metadata = {
  title: "Arf Arf",
  description: "Arf's Personal Website",
}