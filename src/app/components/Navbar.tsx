'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);

  const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';

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
            <button className="relative text-gray-600 hover:text-[#40bfff]">
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-3"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={imageError ? defaultAvatar : (user.avatar || defaultAvatar)}
                      alt="用户头像"
                      width={32}
                      height={32}
                      className="object-cover"
                      onError={() => setImageError(true)}
                      unoptimized={user.avatar?.startsWith('http://localhost')}
                    />
                  </div>
                  <span className="text-gray-700">{user.name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login"
                className="bg-[#ff9500] text-white px-4 py-2 rounded-md hover:bg-[#ff8500] transition-colors"
              >
                登录/注册
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 