'use client';

import Image from 'next/image';
import Link from 'next/link';

const tests = [
  {
    id: 'parent-child',
    title: '亲子教育测试',
    description: '深入了解亲子关系模式，提升教育效果，帮助孩子健康成长。',
    image: '/test/parent-child.jpg',
    color: 'from-blue-400 to-blue-500',
    features: ['专业量表评估', '互动模式分析', '个性化建议']
  },
  {
    id: 'personality',
    title: '性格情绪测试',
    description: '探索性格特征，了解情绪模式，掌握自我调节方法。',
    image: '/test/personality.jpg',
    color: 'from-purple-400 to-purple-500',
    features: ['性格特征分析', '情绪模式识别', '调节方法指导']
  },
  {
    id: 'ability',
    title: '个人能力测试',
    description: '评估个人潜力，发现发展方向，制定提升计划。',
    image: '/test/ability.jpg',
    color: 'from-green-400 to-green-500',
    features: ['能力倾向评估', '发展方向建议', '提升计划制定']
  },
  {
    id: 'social',
    title: '人际社交测试',
    description: '评估社交能力，发现人际关系模式，提供改善建议。',
    image: '/test/social.jpg',
    color: 'from-yellow-400 to-yellow-500',
    features: ['社交能力评估', '关系模式分析', '改善策略建议']
  },
  {
    id: 'marriage',
    title: '婚姻情感测试',
    description: '评估婚恋关系，了解情感需求，促进感情和谐。',
    image: '/test/marriage.jpg',
    color: 'from-pink-400 to-pink-500',
    features: ['情感需求分析', '关系状态评估', '改善方案制定']
  },
  {
    id: 'health',
    title: '健康评定测试',
    description: '全面评估身心健康状况，提供个性化建议。',
    image: '/test/health.jpg',
    color: 'from-red-400 to-red-500',
    features: ['身心状况评估', '压力水平测试', '调适方案建议']
  }
];

export default function TestAnalysis() {
  return (
    <main className="min-h-screen bg-white">
      {/* 头部区域 */}
      <div className="py-12 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">心理测试分析</h1>
          <p className="text-xl text-blue-100">全面的心理测评服务，助您更好地认识自己</p>
        </div>
      </div>

      {/* 测试列表 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* 图片区域 */}
                <div className="md:w-1/3 relative h-64 md:h-auto">
                  <Image
                    src={test.image}
                    alt={test.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${test.color} opacity-20`}></div>
                </div>

                {/* 内容区域 */}
                <div className="md:w-2/3 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{test.title}</h2>
                  <p className="text-gray-600 mb-6">{test.description}</p>
                  
                  {/* 特点列表 */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">测试特点</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {test.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/test/${test.id}`}
                      className={`px-6 py-3 bg-gradient-to-r ${test.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      开始测试
                    </Link>
                    <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                      了解更多
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 