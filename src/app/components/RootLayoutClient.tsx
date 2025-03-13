'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import FloatingMenu from './FloatingMenu';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 检查用户是否登录
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);

    // 监听 storage 变化
    const handleStorageChange = () => {
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!user);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userStateChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userStateChange', handleStorageChange);
    };
  }, []);

  // 判断是否是登录前的首页
  const isLandingPage = pathname === '/' && !isLoggedIn;

  return (
    <div className="min-h-screen relative">
      {/* 背景图片和遮罩层 */}
      {!isLandingPage && (
        <>
          <div className="fixed inset-0 bg-[url('/images/background.jpg')] bg-cover bg-center bg-fixed -z-20" />
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm -z-10" />
        </>
      )}
      <div className="relative z-0">
        <Navbar />
        {isLoggedIn && <FloatingMenu />}
        {children}
      </div>
    </div>
  );
} 