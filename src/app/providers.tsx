'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 从 localStorage 恢复用户会话
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // 检查会话是否过期
        if (session.expires && new Date(session.expires) > new Date()) {
          // 会话未过期，可以继续使用
          return;
        } else {
          // 会话已过期，清除
          localStorage.removeItem('userSession');
        }
      } catch (error) {
        console.error('Error parsing session:', error);
        localStorage.removeItem('userSession');
      }
    }
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
} 