'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { id: 'all', name: '全部', bgColor: 'bg-gray-500', textColor: 'text-gray-600', hoverBg: 'hover:bg-gray-100' },
  { id: 'personal', name: '个人成长', bgColor: 'bg-blue-500', textColor: 'text-blue-600', hoverBg: 'hover:bg-blue-100' },
  { id: 'emotion', name: '情绪管理', bgColor: 'bg-green-500', textColor: 'text-green-600', hoverBg: 'hover:bg-green-100' },
  { id: 'relationship', name: '人际关系', bgColor: 'bg-purple-500', textColor: 'text-purple-600', hoverBg: 'hover:bg-purple-100' },
  { id: 'career', name: '职业发展', bgColor: 'bg-orange-500', textColor: 'text-orange-600', hoverBg: 'hover:bg-orange-100' },
  { id: 'other', name: '其他', bgColor: 'bg-gray-500', textColor: 'text-gray-600', hoverBg: 'hover:bg-gray-100' }
];

interface Author {
  id: number;
  name: string;
  avatar: string | null;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  status: string;
  authorName: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
}

export default function CommunityClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeCategory !== 'all') {
          params.append('category', activeCategory);
        }
        params.append('sortBy', sortBy);
        
        const response = await fetch(`/api/posts?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取帖子失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, sortBy]);

  const handleDelete = async (postId: number) => {
    if (!confirm('确定要删除这个帖子吗？此操作不可恢复。')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      // 从列表中移除已删除的帖子
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('删除失败:', err);
      alert('删除失败，请稍后重试');
    }
  };

  return (
    <>
      {/* 顶部横幅 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">心理社区</h1>
          <p className="text-blue-100">分享你的故事，倾听他人的声音</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* 分类和排序 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col space-y-4">
            {/* 分类标签 */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${activeCategory === category.id
                      ? `${category.bgColor} text-white`
                      : `bg-gray-50 ${category.textColor} ${category.hoverBg}`
                    }`}
                >
                  {category.name}
                  {activeCategory === category.id && (
                    <span className="ml-2 inline-block">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 排序选项 */}
            <div className="flex justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">最新发布</option>
                <option value="popular">最受欢迎</option>
                <option value="unanswered">待回答</option>
              </select>
            </div>
          </div>
        </div>

        {/* 发帖按钮 */}
        <Link
          href="/community/new"
          className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg mb-6 hover:bg-blue-600 transition-colors"
        >
          发布新帖子
        </Link>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 加载提示 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        ) : (
          /* 帖子列表 */
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  {activeCategory === 'all' ? '暂无帖子' : `暂无${categories.find(c => c.id === activeCategory)?.name}分类的帖子`}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {post.authorName ? post.authorName[0] : '匿'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{post.authorName || '匿名用户'}</span>
                          <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="删除帖子"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {categories.find(c => c.id === post.category) && (
                          <span className={`px-2 py-1 text-xs rounded text-white ${categories.find(c => c.id === post.category)?.bgColor}`}>
                            {categories.find(c => c.id === post.category)?.name}
                          </span>
                        )}
                        {post.status && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                            {post.status}
                          </span>
                        )}
                      </div>
                      <Link href={`/community/${post.id}`}>
                        <h3 className="text-xl font-medium text-gray-900 mt-2 hover:text-blue-500">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mt-2">{post.content}</p>
                      
                      {/* 交互按钮 */}
                      <div className="flex items-center space-x-6 mt-4">
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/posts/${post.id}/like`, {
                                method: 'POST',
                              });
                              if (!response.ok) throw new Error('点赞失败');
                              const updatedPost = await response.json();
                              setPosts(posts.map(p => 
                                p.id === updatedPost.id ? updatedPost : p
                              ));
                            } catch (err) {
                              console.error('点赞失败:', err);
                            }
                          }}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{post.likes}</span>
                        </button>
                        <Link
                          href={`/community/${post.id}`}
                          className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{post.comments}</span>
                        </Link>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
} 