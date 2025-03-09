'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const defaultAvatarPath = '/avatars/user1.png';

interface UserInfo {
  id: string | number;
  name: string;
  email: string;
  image?: string;
}

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 组件加载时从 localStorage 读取用户信息
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userInfo = JSON.parse(savedUser);
        setUser(userInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // 点击页面其他地方关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown) {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setShowDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-[#40bfff] font-bold text-2xl">MindAI</div>
              <div className="ml-2 text-gray-600 text-sm">您身边的心理医生</div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#40bfff]">
              首页
            </Link>
            <Link href="/test-analysis" className="text-gray-700 hover:text-[#40bfff]">
              AI测试分析
            </Link>
            <Link href="/emotion-analysis" className="text-gray-700 hover:text-[#40bfff]">
              AI情绪分析
            </Link>
            <Link href="/ai-consultation" className="text-gray-700 hover:text-[#40bfff]">
              AI咨询
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-[#40bfff]">
              心理社区
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button className="relative text-gray-600 hover:text-[#40bfff]">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    0
                  </span>
                </button>
                
                <div className="relative" id="user-dropdown">
                  <button
                    className="flex items-center space-x-3"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="w-8 h-8 relative">
                      <Image
                        src={user.image || defaultAvatarPath}
                        alt={user.name || '用户头像'}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        priority
                      />
                    </div>
                    <span className="text-gray-700">{user.name}</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <Link
                        href="/profile"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        个人资料
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="bg-[#40bfff] text-white px-4 py-2 rounded-md hover:bg-[#3ab1eb] transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-[#ff9500] text-white px-4 py-2 rounded-md hover:bg-[#ff8500] transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 