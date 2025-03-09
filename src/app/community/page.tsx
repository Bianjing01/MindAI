'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  author: {
    name: string;
    image: string;
  };
  _count: {
    comments: number;
    likes: number;
    favorites: number;
  };
  viewCount: number;
  isLiked?: boolean;
  isFavorited?: boolean;
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [userId, setUserId] = useState<number | null>(null);

  const categories = ['全部', '情感', '学业', '职场', '家庭', '社交', '其他'];
  const categoryMapping = {
    '全部': 'all',
    '情感': '情感',
    '学业': '学业',
    '职场': '职场',
    '家庭': '家庭',
    '社交': '社交',
    '其他': '其他'
  };

  useEffect(() => {
    // 获取当前用户ID
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(parseInt(user.id));
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy]);

  const fetchPosts = async () => {
    try {
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        sortBy: sortBy
      });
      const response = await fetch(`/api/posts?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('获取帖子列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const handleLike = async (postId: number) => {
    if (!userId) {
      alert('请先登录');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const { liked } = await response.json();
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              _count: {
                ...post._count,
                likes: liked ? (post._count.likes + 1) : (post._count.likes - 1)
              },
              isLiked: liked
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleFavorite = async (postId: number) => {
    if (!userId) {
      alert('请先登录');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const { favorited } = await response.json();
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              _count: {
                ...post._count,
                favorites: favorited ? (post._count.favorites + 1) : (post._count.favorites - 1)
              },
              isFavorited: favorited
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('收藏失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 顶部操作栏 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(categoryMapping[category])}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedCategory === categoryMapping[category]
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">最新发布</option>
                <option value="popular">最多评论</option>
              </select>
              <Link
                href="/community/create"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                发布帖子
              </Link>
            </div>
          </div>

          {/* 帖子列表 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/community/${post.id}`}>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Image
                        src={post.author.image || '/default-avatar.png'}
                        alt={post.author.name || '用户'}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-sm text-gray-600">{post.author.name || '匿名用户'}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleLike(post.id);
                          }}
                          className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-500' : ''}`}
                        >
                          <span>{post.isLiked ? '❤️' : '🤍'}</span>
                          <span>{post._count.likes}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleFavorite(post.id);
                          }}
                          className={`flex items-center space-x-1 ${post.isFavorited ? 'text-yellow-500' : ''}`}
                        >
                          <span>{post.isFavorited ? '⭐' : '☆'}</span>
                          <span>{post._count.favorites}</span>
                        </button>
                        <span title="评论数" className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{post._count.comments}</span>
                        </span>
                        <span title="浏览量" className="flex items-center space-x-1">
                          <span>👁️</span>
                          <span>{post.viewCount}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* 分页控件 */}
          <div className="mt-8 flex justify-center">
            {/* ... existing pagination code ... */}
          </div>
        </div>
      </div>
    </div>
  );
} 