'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TestResult {
  category: string;
  score: number;
  date: string;
  details: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  userId: string;
  user: {
    name: string;
    image: string;
  };
}

export default function ProfileClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');

  const categories = [
    { id: 'ability', name: '能力测评', color: 'from-blue-500 to-blue-600' },
    { id: 'health', name: '心理健康', color: 'from-green-500 to-green-600' },
    { id: 'marriage', name: '婚恋测评', color: 'from-pink-500 to-pink-600' },
    { id: 'parent-child', name: '亲子关系', color: 'from-yellow-500 to-yellow-600' },
    { id: 'personality', name: '性格测评', color: 'from-purple-500 to-purple-600' },
    { id: 'social', name: '社交能力', color: 'from-red-500 to-red-600' }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/auth/login');
      return;
    }

    const userInfo = JSON.parse(savedUser);
    setUser(userInfo);
    setNewName(userInfo.name);
    setLoading(false);

    // 获取用户测评结果
    fetchTestResults(userInfo.id);
    // 获取用户的帖子和评论
    fetchUserPosts(userInfo.id);
    fetchUserComments(userInfo.id);
  }, [router]);

  const fetchTestResults = async (userId: string) => {
    try {
      const response = await fetch(`/api/test-results/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTestResults(data);
      }
    } catch (error) {
      console.error('获取测评结果失败:', error);
    }
  };

  const fetchUserPosts = async (userId: string) => {
    try {
      const response = await fetch(`/api/posts/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserPosts(data);
      }
    } catch (error) {
      console.error('获取用户帖子失败:', error);
    }
  };

  const fetchUserComments = async (userId: string) => {
    try {
      const response = await fetch(`/api/comments/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserComments(data);
      }
    } catch (error) {
      console.error('获取用户评论失败:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData();
    formData.append('name', newName);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    formData.append('userId', user.id);

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('个人信息更新成功！');
      }
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 个人信息编辑区域 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">个人资料</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-8">
              <div className="relative w-24 h-24">
                <Image
                  src={previewUrl || user?.image || '/default-avatar.png'}
                  alt="头像"
                  fill
                  className="rounded-lg object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  ✏️
                </label>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  昵称
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              保存修改
            </button>
          </form>
        </div>

        {/* 帖子和评论区域 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'posts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('posts')}
            >
              我的帖子
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'comments'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('comments')}
            >
              我的评论
            </button>
          </div>

          {activeTab === 'posts' ? (
            <div className="space-y-4">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <Link href={`/community/${post.id}`} className="block">
                      <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-gray-600 line-clamp-2">{post.content}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        发布于 {new Date(post.createdAt).toLocaleDateString()}
                        <span className="ml-4">{post.comments.length} 条评论</span>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">还没有发布过帖子</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {userComments.length > 0 ? (
                userComments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <Link href={`/community/${comment.postId}`} className="block">
                      <p className="text-gray-600">{comment.content}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        评论于 {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">还没有发表过评论</p>
              )}
            </div>
          )}
        </div>

        {/* 测评结果展示区域 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">测评结果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-lg overflow-hidden shadow-md"
              >
                <div className={`bg-gradient-to-r ${category.color} p-4 text-white`}>
                  <h3 className="font-bold">{category.name}</h3>
                  {testResults[category.id] ? (
                    <div className="mt-2">
                      <div className="text-2xl font-bold">
                        {testResults[category.id].score}分
                      </div>
                      <div className="text-sm opacity-80">
                        测评日期: {testResults[category.id].date}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-sm opacity-80">暂无测评数据</div>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-600">
                    {testResults[category.id]?.details || '完成测评后查看详细分析'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 