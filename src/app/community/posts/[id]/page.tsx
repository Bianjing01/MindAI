'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import CommentForm from '../../components/CommentForm';
import CommentList from '../../components/CommentList';

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      if (!response.ok) {
        throw new Error('获取帖子失败');
      }
      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取帖子失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  if (isLoading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  if (error || !post) {
    return (
      <div className="text-center py-8 text-red-500">
        {error || '帖子不存在'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src={post.user.image || '/images/default-avatar.png'}
              alt={post.user.name || '用户头像'}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">
                {post.user.name || '匿名用户'}
              </p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {post.title}
          </h1>
          <div className="prose max-w-none">
            {post.content}
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">评论</h2>
          <CommentForm
            postId={post.id}
            onSuccess={() => {
              // 刷新评论列表
              router.refresh();
            }}
          />
          <div className="mt-6">
            <CommentList postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
} 