'use client';

import Link from 'next/link';

const emotions = [
  {
    id: 'daily',
    title: '日常情绪分析',
    description: '通过AI分析您的日常情绪状态，提供个性化调节建议',
    icon: '🌈',
    color: 'from-blue-400 to-blue-500'
  },
  {
    id: 'work',
    title: '工作压力分析',
    description: '评估工作压力水平，提供专业的减压方案',
    icon: '💼',
    color: 'from-purple-400 to-purple-500'
  },
  {
    id: 'relationship',
    title: '人际情绪分析',
    description: '分析人际交往中的情绪变化，改善社交关系',
    icon: '🤝',
    color: 'from-green-400 to-green-500'
  },
  {
    id: 'family',
    title: '家庭情绪分析',
    description: '探索家庭关系中的情绪互动，促进家庭和谐',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-yellow-400 to-yellow-500'
  }
];

export default function EmotionList() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI情绪分析</h2>
          <p className="text-gray-600">基于中医五行理论的智能情绪分析系统</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {emotions.map((emotion) => (
            <Link
              key={emotion.id}
              href={`/emotion-analysis/${emotion.id}`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${emotion.color} opacity-75 group-hover:opacity-85 transition-opacity duration-300`} />
              <div className="relative p-6">
                <div className="text-4xl mb-4">{emotion.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {emotion.title}
                </h3>
                <p className="text-white/90 text-sm">
                  {emotion.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/emotion-analysis"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            开始情绪分析
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 