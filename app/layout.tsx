import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Sahla — Apprendre la darija algérienne en arabizi',
    template: '%s | Sahla',
  },
  description:
    "Sahla, c'est l'app pour apprendre l'arabe algérien (darija) comme on le parle vraiment. 2327 mots, 69 verbes conjugués, 41 règles de grammaire.",
  metadataBase: new URL('https://sahla.app'),
  openGraph: {
    siteName: 'Sahla',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sahlaapp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
