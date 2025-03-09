'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

interface CommentListProps {
  postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('获取评论失败');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取评论失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (isLoading) {
    return <div className="text-center py-4">加载评论中...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (comments.length === 0) {
    return <div className="text-center text-gray-500 py-4">暂无评论</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-3 p-4 bg-white rounded-lg shadow">
          <div className="flex-shrink-0">
            <Image
              src={comment.user.image || '/images/default-avatar.png'}
              alt={comment.user.name || '用户头像'}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {comment.user.name || '匿名用户'}
            </p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: zhCN,
              })}
            </p>
            <div className="mt-1 text-sm text-gray-700">{comment.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 