'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HomeClient from "./components/HomeClient";

const ANONYMOUS_AVATAR = '/images/anonymous-avatar.png';

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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?limit=6');
      if (response.ok) {
        const data = await response.json();
        // 确保只显示6个帖子
        setPosts(data.slice(0, 6));
      }
    } catch (error) {
      console.error('获取帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 根据分类返回不同的背景色
  const getCategoryStyle = (category: string) => {
    const styles = {
      '情感': 'bg-pink-100 text-pink-800 border-pink-200',
      '学业': 'bg-blue-100 text-blue-800 border-blue-200',
      '职场': 'bg-purple-100 text-purple-800 border-purple-200',
      '家庭': 'bg-green-100 text-green-800 border-green-200',
      '社交': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      '其他': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return styles[category as keyof typeof styles] || styles['其他'];
  };

  // 格式化日期
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

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeClient />
      
      {/* 心理社区评论区 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">心理社区动态</h2>
            <p className="mt-4 text-gray-600">来自心理社区的真实分享与交流</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">加载中...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {posts.map((post) => (
                <Link key={post.id} href={`/community/${post.id}`}>
                  <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow h-full">
                    <div className="flex items-center mb-4">
                      <img
                        src={post.author?.image || ANONYMOUS_AVATAR}
                        alt={post.author?.name || '匿名用户'}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium">{post.author?.name || '匿名用户'}</div>
                        <div className="text-sm text-gray-500">{formatDate(post.createdAt)}</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">分类：{post.category}</span>
                      <span>评论：{post._count?.comments || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link 
              href="/community" 
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              查看更多讨论
            </Link>
          </div>
        </div>
      </section>

      {/* 友情链接和版权信息 */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* 友情链接 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">友情链接</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-gray-500 mb-2">心理咨询</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://www.12355.net/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        青少年服务平台
                      </a>
                    </li>
                    <li>
                      <a href="http://www.12320.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        健康咨询服务平台
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-gray-500 mb-2">技术支持</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        Next.js
                      </a>
                    </li>
                    <li>
                      <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        Tailwind CSS
                      </a>
                    </li>
                    <li>
                      <a href="https://www.prisma.io/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        Prisma
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-gray-500 mb-2">社区支持</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        Github
                      </a>
                    </li>
                    <li>
                      <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        Vercel
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-gray-500 mb-2">更多资源</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://www.who.int/zh/news-room/fact-sheets/detail/mental-health" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        世界卫生组织
                      </a>
                    </li>
                    <li>
                      <a href="http://www.cma.org.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        中国心理学会
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 分割线 */}
            <div className="border-t border-gray-800 my-8"></div>

            {/* 版权信息 */}
            <div className="text-center text-sm">
              <p className="mb-2">© 2024 MindAI 心理健康平台. All rights reserved.</p>
              <div className="flex justify-center space-x-4">
                <a href="/terms" className="hover:text-blue-400 transition-colors">服务协议</a>
                <a href="/privacy" className="hover:text-blue-400 transition-colors">隐私政策</a>
                <a href="/contact" className="hover:text-blue-400 transition-colors">联系我们</a>
              </div>
              <p className="mt-4 text-gray-600">
                浙ICP备2024xxxxxx号-1 | 浙公网安备 33011002011859号
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
