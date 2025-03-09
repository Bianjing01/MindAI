'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  postId: number;
  onSuccess?: () => void;
}

export default function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      alert('请先登录');
      router.push('/auth/login');
      return;
    }

    if (!content.trim()) {
      alert('请输入评论内容');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '评论失败');
      }

      setContent('');
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error('评论失败:', error);
      alert('评论失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div>
        <label htmlFor="comment" className="sr-only">
          评论内容
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="写下你的评论..."
        />
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? '发送中...' : '发送评论'}
        </button>
      </div>
    </form>
  );
} 