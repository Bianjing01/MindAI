'use client';

import Link from 'next/link';
import Image from 'next/image';

const tests = [
  {
    id: 'parent-child',
    title: '亲子教育测试',
    subtitle: '深入了解亲子关系',
    image: '/test/parent-child.jpg',
    color: 'from-blue-400/50 to-blue-500/50'
  },
  {
    id: 'personality',
    title: '性格情绪测试',
    subtitle: '探索性格特征',
    image: '/test/personality.jpg',
    color: 'from-purple-400/50 to-purple-500/50'
  },
  {
    id: 'ability',
    title: '个人能力测试',
    subtitle: '评估个人潜力',
    image: '/test/ability.jpg',
    color: 'from-green-400/50 to-green-500/50'
  },
  {
    id: 'social',
    title: '人际社交测试',
    subtitle: '分析社交模式',
    image: '/test/social.jpg',
    color: 'from-yellow-400/50 to-yellow-500/50'
  },
  {
    id: 'marriage',
    title: '婚姻情感测试',
    subtitle: '评估感情状况',
    image: '/test/marriage.jpg',
    color: 'from-pink-400/50 to-pink-500/50'
  },
  {
    id: 'health',
    title: '健康评定测试',
    subtitle: '全面健康评估',
    image: '/test/health.jpg',
    color: 'from-red-400/50 to-red-500/50'
  }
];

export default function TestNav() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">心理测试</h2>
          <Link 
            href="/test-analysis"
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            查看更多 {'>'}
          </Link>
        </div>
        
        <div className="relative">
          {/* 测试卡片滚动容器 */}
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {tests.map((test) => (
              <Link
                key={test.id}
                href={`/test/${test.id}`}
                className="flex-shrink-0 group relative w-[300px] h-[180px] rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                {/* 背景图片 */}
                <div className="absolute inset-0">
                  <Image
                    src={test.image}
                    alt={test.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                
                {/* 渐变遮罩 */}
                <div className={`absolute inset-0 bg-gradient-to-r ${test.color} mix-blend-multiply`} />
                
                {/* 文字内容 */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {test.title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {test.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* 滚动指示器 */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
} 