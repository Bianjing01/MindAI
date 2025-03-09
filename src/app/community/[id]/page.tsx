'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState({
    content: '',
    authorName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postResponse, commentsResponse] = await Promise.all([
          fetch(`/api/posts/${params.id}`),
          fetch(`/api/posts/${params.id}/comments`)
        ]);

        if (!postResponse.ok) {
          throw new Error('帖子不存在');
        }

        const postData = await postResponse.json();
        const commentsData = await commentsResponse.json();

        setPost(postData);
        setComments(commentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleLike = async () => {
    if (!post) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('点赞失败');
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      setIsLiked(true);
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error('发表评论失败');
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setPost({
        ...post,
        comments: post.comments + 1
      });
      setNewComment({ content: '', authorName: '' });
    } catch (err) {
      console.error('发表评论失败:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error || '帖子不存在'}
            </div>
            <div className="mt-4">
              <Link
                href="/community"
                className="text-blue-500 hover:text-blue-600"
              >
                返回社区
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
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

          {/* 帖子内容 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {post.authorName[0]}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{post.authorName}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                    {post.category}
                  </span>
                  {post.status && (
                    <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">
                      {post.status}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mt-4">
                  {post.title}
                </h1>
                <div className="prose mt-4">
                  <p className="text-gray-600">{post.content}</p>
                </div>

                {/* 交互按钮 */}
                <div className="flex items-center space-x-6 mt-8 pt-6 border-t">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 ${
                      isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    } transition-colors`}
                  >
                    <svg className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{post.likes}</span>
                  </button>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{post.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 评论区 */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">评论 ({post.comments})</h2>

            {/* 评论表单 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
                    昵称
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    value={newComment.authorName}
                    onChange={(e) => setNewComment({ ...newComment, authorName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入昵称"
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    评论内容
                  </label>
                  <textarea
                    id="content"
                    value={newComment.content}
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入评论内容"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? '发表中...' : '发表评论'}
                  </button>
                </div>
              </form>
            </div>

            {/* 评论列表 */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {comment.authorName[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{comment.authorName}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 