'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ANONYMOUS_AVATAR = '/images/anonymous-avatar.png';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image: string;
  };
}

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
  };
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      }
    } catch (error) {
      console.error('获取帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      alert('请输入评论内容');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('请先登录');
        router.push('/login');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = parseInt(user.id);

      const response = await fetch(`/api/posts/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: userId,
          isAnonymous: isAnonymous
        }),
      });

      if (response.ok) {
        setNewComment('');
        setIsAnonymous(false);
        // 先更新评论列表
        await fetchComments();
        // 然后更新帖子数据以获取最新的评论数
        await fetchPost();
      } else {
        throw new Error('评论失败');
      }
    } catch (error) {
      console.error('提交评论失败:', error);
      alert('评论失败，请重试');
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

  // 更新评论区标题显示
  const commentCount = comments.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">帖子不存在</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <Link
            href="/community"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回社区
          </Link>

          {/* 帖子内容 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <img
                src={post.author?.image || ANONYMOUS_AVATAR}
                alt={post.author?.name || '匿名用户'}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-semibold">{post.author?.name || '匿名用户'}</div>
                <div className="text-sm text-gray-500">{formatDate(post.createdAt)}</div>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="mr-4">分类：{post.category}</span>
              <span>评论：{commentCount}</span>
            </div>
          </div>

          {/* 评论区 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">评论 ({commentCount})</h2>
            
            {/* 评论输入框 */}
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的评论..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                    匿名评论
                  </label>
                </div>
                <button
                  onClick={handleSubmitComment}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  发表评论
                </button>
              </div>
            </div>

            {/* 评论列表 */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center mb-3">
                    <img
                      src={comment.author?.image || ANONYMOUS_AVATAR}
                      alt={comment.author?.name || '匿名用户'}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium">{comment.author?.name || '匿名用户'}</div>
                      <div className="text-sm text-gray-500">{formatDate(comment.createdAt)}</div>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  还没有评论，来说两句吧~
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 