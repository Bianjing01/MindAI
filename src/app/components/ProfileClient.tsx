'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MoodRecordModal from './MoodRecordModal';

interface TestResult {
  category: string;
  score: number;
  date: string;
  details: string;
  totalScore: number;
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

interface MoodRecord {
  date: string;
  mood: string;
  note: string;
  color: string;
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
  const [weekMoods, setWeekMoods] = useState<MoodRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'ability', name: '能力测评', color: 'from-blue-500 to-blue-600' },
    { id: 'health', name: '心理健康', color: 'from-green-500 to-green-600' },
    { id: 'marriage', name: '婚恋测评', color: 'from-pink-500 to-pink-600' },
    { id: 'parent-child', name: '亲子关系', color: 'from-yellow-500 to-yellow-600' },
    { id: 'personality', name: '性格测评', color: 'from-purple-500 to-purple-600' },
    { id: 'social', name: '社交能力', color: 'from-red-500 to-red-600' }
  ];

  // 心情类型定义
  const moodTypes = [
    { name: '精彩！', emoji: '😊', color: 'bg-red-100', textColor: 'text-red-800' },
    { name: '感觉棒极了~', emoji: '☺️', color: 'bg-orange-100', textColor: 'text-orange-800' }
  ];

  // 获取一周的日期
  const getWeekDays = () => {
    const days = ['一', '二', '三', '四', '五', '六', '日'];
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // 将周日的0转换为7
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1); // 设置为本周一
    
    return days.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        name: day,
        date: date.toISOString().split('T')[0]
      };
    });
  };

  const weekDays = getWeekDays();

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
    // 获取心情记录
    fetchMoodRecords();
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

  // 模拟从数据库获取心情记录
  const fetchMoodRecords = async () => {
    if (!user) return;

    try {
      const weekDays = getWeekDays();
      const startDate = weekDays[0].date;
      const endDate = weekDays[6].date;

      const response = await fetch(
        `/api/moods?userId=${user.id}&startDate=${startDate}&endDate=${endDate}`
      );

      if (response.ok) {
        const data = await response.json();
        const moodMap = data.reduce((acc: Record<string, any>, mood: any) => {
          acc[mood.date] = mood;
          return acc;
        }, {});

        setWeekMoods(
          weekDays.map(day => ({
            date: day.date,
            mood: moodMap[day.date]?.mood || '',
            note: moodMap[day.date]?.note || '',
            color: moodTypes.find(m => m.name === moodMap[day.date]?.mood)?.color || ''
          }))
        );
      }
    } catch (error) {
      console.error('获取心情记录失败:', error);
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

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          name: newName,
          image: previewUrl || user.image
        })
      });

      if (!response.ok) {
        throw new Error('更新失败');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('更新成功');
    } catch (error) {
      console.error('更新用户信息失败:', error);
      alert('更新失败，请重试');
    }
  };

  // 处理心情记录提交
  const handleMoodSubmit = async (mood: string, note: string) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch('/api/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          date: today,
          mood,
          note
        }),
      });

      if (!response.ok) {
        throw new Error('保存失败');
      }

      // 重新获取心情记录
      await fetchMoodRecords();
    } catch (error) {
      console.error('保存心情记录失败:', error);
      alert('保存失败，请重试');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 个人信息编辑区域 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">个人资料</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
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

        {/* 心情记录区域 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">本周心情</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            {/* 表头 */}
            <div className="grid grid-cols-7 bg-gray-100">
              {weekDays.map((day, index) => (
                <div key={index} className="p-2 font-semibold text-gray-700 text-center border-r border-gray-200 last:border-r-0">
                  周{day.name}
                </div>
              ))}
            </div>

            {/* 单行心情显示 */}
            <div className="grid grid-cols-7">
              {weekDays.map((day, dayIndex) => {
                const record = weekMoods.find(m => m.date === day.date);
                const mood = record ? moodTypes.find(m => m.name === record.mood) : null;
                const isToday = day.date === new Date().toISOString().split('T')[0];
                return (
                  <div
                    key={dayIndex}
                    className={`p-4 min-h-[80px] flex items-center justify-center border-r border-gray-200 last:border-r-0 ${
                      mood ? mood.color : 'bg-gray-50'
                    } ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    {mood ? (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl">{mood.emoji}</span>
                        <span className="text-xs mt-1">{record.note || mood.name}</span>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">未记录</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 添加心情记录按钮 */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              记录今天的心情
            </button>
          </div>
        </div>

        {/* 帖子和评论区域 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">发布时间</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">评论数</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link href={`/community/${post.id}`} className="block">
                            <div className="text-sm font-medium text-gray-900 hover:text-blue-600">{post.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{post.content}</div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 text-center">
                          {post.comments.length}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-sm text-gray-500 text-center">
                        还没有发布过帖子
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评论内容</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">评论时间</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userComments.length > 0 ? (
                    userComments.map((comment) => (
                      <tr key={comment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Link href={`/community/${comment.postId}`} className="block">
                            <div className="text-sm text-gray-600 line-clamp-1">{comment.content}</div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-3 text-sm text-gray-500 text-center">
                        还没有发表过评论
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 测评结果展示区域 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">测评结果</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => {
              const result = testResults[category.id];
              return (
                <div
                  key={category.id}
                  className="rounded-lg overflow-hidden border border-gray-200"
                >
                  <div className={`bg-gradient-to-r ${category.color} p-4 text-white flex justify-between items-center`}>
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    {result && (
                      <div className="text-2xl font-bold bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        {result.totalScore}分
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white">
                    {result ? (
                      <>
                        <div className="text-sm text-gray-500 mb-2">
                          测评日期: {new Date(result.date).toLocaleDateString()}
                        </div>
                        <p className="text-sm text-gray-600">{result.details}</p>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-2">
                        暂无测评数据
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 心情记录模态框 */}
        <MoodRecordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleMoodSubmit}
        />
      </div>
    </div>
  );
} 