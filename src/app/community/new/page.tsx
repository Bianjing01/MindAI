'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const categories = [
  { id: 'personal', name: '个人成长', bgColor: 'bg-blue-500' },
  { id: 'emotion', name: '情绪管理', bgColor: 'bg-green-500' },
  { id: 'relationship', name: '人际关系', bgColor: 'bg-purple-500' },
  { id: 'career', name: '职业发展', bgColor: 'bg-orange-500' },
  { id: 'other', name: '其他', bgColor: 'bg-gray-500' }
];

export default function NewPost() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 从 localStorage 获取用户信息
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // 表单验证
      if (!formData.title.trim()) {
        throw new Error('请输入标题');
      }
      if (!formData.content.trim()) {
        throw new Error('请输入内容');
      }
      if (!formData.category) {
        throw new Error('请选择分类');
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id, // 添加用户ID
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '发布失败');
      }

      router.push('/community');
    } catch (err) {
      setError(err instanceof Error ? err.message : '发布失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">发布新帖子</h1>
          <p className="text-blue-100">分享你的故事，倾听他人的声音</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 返回按钮 */}
          <Link
            href="/community"
            className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回社区
          </Link>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* 当前用户信息 */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-600">
              当前用户：{user?.name || '未登录'}
            </p>
          </div>

          {/* 表单卡片 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  标题
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入标题"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  分类
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${formData.category === category.id
                          ? `${category.bgColor} text-white`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  内容
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入内容"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href="/community"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !user}
                  className={`px-6 py-2 bg-blue-500 text-white rounded-lg transition-colors
                    ${(isSubmitting || !user) ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                  {isSubmitting ? '发布中...' : '发布'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 