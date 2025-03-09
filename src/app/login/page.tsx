'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import AuthBackground from '../components/AuthBackground';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('登录失败，请检查您的邮箱和密码');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* 左侧登录表单 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Login
          </h1>
          <p className="text-gray-600 mb-8">Welcome back! Please login to your account.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-colors text-gray-700 text-sm"
                  placeholder="user name/e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] transition-colors text-gray-700 text-sm"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-[#2196F3] transition duration-150 ease-in-out rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[#2196F3] hover:text-[#1976D2]">
                Forget Password?
              </Link>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#2196F3] hover:bg-[#1976D2] text-white font-medium rounded-lg transition duration-150 ease-in-out"
            >
              Login
            </button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account yet?{' '}
              <Link href="/register" className="text-[#2196F3] hover:text-[#1976D2] font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* 右侧背景 */}
      <AuthBackground />
    </div>
  );
} 