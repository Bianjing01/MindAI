'use client';

import Image from 'next/image';
import Link from 'next/link';

const tests = [
  {
    id: 'parent-child',
    title: '亲子教育测试',
    image: '/test/parent-child.jpg',
    description: '深入了解亲子关系模式，提升教育效果，帮助孩子健康成长。通过专业量表评估亲子互动方式，发现教育盲点。',
    isNew: true
  },
  {
    id: 'personality',
    title: '性格情绪测试',
    image: '/test/personality.jpg',
    description: '探索性格特征，了解情绪模式，掌握自我调节方法。基于专业人格理论，提供个性化分析报告。'
  },
  {
    id: 'ability',
    title: '个人能力测试',
    image: '/test/ability.jpg',
    description: '评估个人潜力，发现发展方向，制定提升计划。全面测评认知能力、学习能力和职业倾向。'
  },
  {
    id: 'social',
    title: '人际社交测试',
    image: '/test/social.jpg',
    description: '评估社交能力，发现人际关系模式，提供改善建议。'
  },
  {
    id: 'marriage',
    title: '婚姻情感测试',
    image: '/test/marriage.jpg',
    description: '评估婚恋关系，了解情感需求，促进感情和谐。'
  },
  {
    id: 'health',
    title: '健康评定测试',
    image: '/test/health.jpg',
    description: '全面评估身心健康状况，提供个性化建议。'
  }
];

export default function TestCards() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* 模块标题和查看全部按钮 */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">心理测试</h2>
            <p className="text-gray-600 mt-2">专业的心理测评，助您更好地认识自己</p>
          </div>
          <Link 
            href="/test-analysis"
            className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            查看全部
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* 测试卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 group">
                <Image
                  src={test.image}
                  alt={test.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                {test.isNew && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    新品推荐
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {test.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {test.description}
                </p>
                <Link
                  href={`/test/${test.id}`}
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors group"
                >
                  <span className="font-medium">开始测试</span>
                  <svg
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 