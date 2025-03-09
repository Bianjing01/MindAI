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
        className={`${menuItemStyle} flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors shadow-lg`}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl">👤</span>
          <span className="text-xs text-gray-600">我的</span>
        </div>
      </Link>
      <Link
        href="/ai-consultation"
        className={`${menuItemStyle} flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors shadow-lg`}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl ">💭</span>
          <span className="text-xs text-gray-600">AI通话</span>
        </div>
      </Link>
      <button
        onClick={scrollToTop}
        className={`${menuItemStyle} flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg hover:bg-green-200 transition-colors shadow-lg`}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl ">⬆️</span>
          <span className="text-xs text-gray-600">顶部</span>
        </div>
      </button>
    </div>
  );
} 