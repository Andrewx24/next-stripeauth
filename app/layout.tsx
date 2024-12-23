import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Providers from './Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Subscription App',
  description: 'A Next.js app with subscriptions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}