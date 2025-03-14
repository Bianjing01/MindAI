'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';

interface UserInfo {
  id: string | number;
  name: string;
  email: string;
  image?: string;
}

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 组件加载和每次重新渲染时检查用户状态
    const checkUserStatus = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userInfo = JSON.parse(savedUser);
          setUser(userInfo);
        } catch (error) {
          console.error('Error parsing user info:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUserStatus();

    // 监听 storage 变化
    const handleStorageChange = () => {
      checkUserStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    // 添加自定义事件监听器
    window.addEventListener('userStateChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userStateChange', handleStorageChange);
    };
  }, []);

  // 如果是首页且未登录，不显示导航栏
  if (pathname === '/' && !user) {
    return null;
  }

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    router.push('/');
    // 触发自定义事件
    window.dispatchEvent(new Event('userStateChange'));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // 创建 FormData 对象
      const formData = new FormData();
      formData.append('file', file);

      // 上传到图片服务器（这里使用示例 URL，你需要替换为实际的上传服务）
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('上传失败');
      }

      const { url } = await uploadResponse.json();

      // 更新用户头像
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          avatarUrl: url,
        }),
      });

      if (!response.ok) {
        throw new Error('更新头像失败');
      }

      const { user: updatedUser } = await response.json();
      
      // 更新本地存储
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // 触发用户状态更新事件
      window.dispatchEvent(new Event('userStateChange'));
    } catch (error) {
      console.error('更新头像失败:', error);
      alert('更新头像失败，请重试');
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href={user ? '/home' : '/'} className="flex items-center">
              <Image
                src="/logo.png"
                alt="MindAI Logo"
                width={180}
                height={60}
                className="h-14 w-auto"
                priority
              />
              <div className="ml-2 text-gray-600 text-sm">您身边的心理医生</div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={user ? '/home' : '/'} className="text-gray-700 hover:text-[#40bfff]">
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
                    <div 
                      className="w-8 h-8 relative cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Image
                        src={user.image || '/images/default-avatar.png'}
                        alt={user.name || '用户头像'}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        priority
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
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
              <>
                <button
                  onClick={() => router.push('/?login=true')}
                  className="px-4 py-2 text-[#40bfff] hover:text-blue-600 font-medium"
                >
                  登录
                </button>
                <button
                  onClick={() => router.push('/?register=true')}
                  className="px-4 py-2 bg-[#40bfff] text-white rounded-md hover:bg-blue-600 font-medium"
                >
                  注册
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 