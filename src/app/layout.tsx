import type { Metadata } from 'next';
import { Inter, Emblema_One } from 'next/font/google';
import './globals.css';
import RootLayoutClient from './components/RootLayoutClient';

const inter = Inter({ subsets: ['latin'] });

const emblemaOne = Emblema_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-emblema-one',
});

export const metadata: Metadata = {
  title: 'Mind AI - 您身边的心理医生',
  description: 'AI驱动的心理健康服务平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} ${emblemaOne.variable}`}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}