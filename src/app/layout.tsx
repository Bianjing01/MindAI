import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from './components/Navbar';
import FloatingMenu from './components/FloatingMenu';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MindAI - 您身边的心理医生',
  description: '专业的AI心理咨询和测试平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
        <FloatingMenu />
      </body>
    </html>
  );
}