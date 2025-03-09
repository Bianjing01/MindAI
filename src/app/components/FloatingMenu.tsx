'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FloatingMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userInfo = JSON.parse(savedUser);
        setUser(userInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const menuItemStyle = "w-14 h-14 flex items-center justify-center text-white font-medium shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer";

  return (
    <div className="fixed bottom-20 right-4 flex flex-col gap-3 z-50">
      <Link
        href={user ? "/profile" : "/auth/login"}
        className={`${menuItemStyle} bg-gradient-to-r from-blue-500 to-blue-600`}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-0.5">👤</span>
          <span className="text-xs">我的</span>
        </div>
      </Link>
      <Link
        href="/ai-consultation"
        className={`${menuItemStyle} bg-gradient-to-r from-purple-500 to-purple-600`}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-0.5">🤖</span>
          <span className="text-xs">AI通话</span>
        </div>
      </Link>
      <button
        onClick={scrollToTop}
        className={`${menuItemStyle} bg-gradient-to-r from-green-500 to-green-600`}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-0.5">⬆️</span>
          <span className="text-xs">顶部</span>
        </div>
      </button>
    </div>
  );
} 