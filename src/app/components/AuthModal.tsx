'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          ...(mode === 'register' ? { name: nickname } : {})
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '操作失败');
      }

      if (mode === 'register') {
        // 注册成功，显示成功消息并切换到登录模式
        alert('注册成功！请登录');
        setEmail('');
        setPassword('');
        setNickname('');
        // 切换到登录模式
        onModeChange('login');
        return;
      }

      if (data.success) {
        // 保存用户信息到 localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 触发用户状态更新事件
        window.dispatchEvent(new Event('userStateChange'));
        
        // 清空表单
        setEmail('');
        setPassword('');
        setNickname('');
        
        // 关闭模态框
        onClose();
        
        // 跳转到home页
        router.push('/home');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* 模态框容器 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-gradient-to-br from-purple-100 via-pink-100 to-purple-100 p-8 rounded-3xl">
          <div className="relative">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-normal text-green-800 mb-2" style={{ fontFamily: 'var(--font-emblema-one)' }}>
                JULIANA & TAYLOR
              </h2>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-blue-300 text-center mb-8">
              {mode === 'login' ? '登录' : '注册'}
            </h3>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'register' && (
                <div>
                  <label htmlFor="nickname" className="block text-lg text-blue-300 mb-2">
                    昵称
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-6 py-3 bg-transparent border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-400 text-gray-700"
                    required
                    disabled={loading}
                    minLength={2}
                    maxLength={20}
                    placeholder="请输入昵称"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-lg text-blue-300 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-3 bg-transparent border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-400 text-gray-700"
                  required
                  disabled={loading}
                  placeholder="请输入邮箱"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-lg text-blue-300 mb-2">
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-3 bg-transparent border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-400 text-gray-700"
                  required
                  disabled={loading}
                  minLength={6}
                  placeholder={mode === 'register' ? "请设置密码（至少6位）" : "请输入密码"}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white text-lg rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('');
                    setPassword('');
                    setNickname('');
                    onModeChange(mode === 'login' ? 'register' : 'login');
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {mode === 'login' ? '没有账号？点击注册' : '已有账号？点击登录'}
                </button>
              </div>
            </form>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 