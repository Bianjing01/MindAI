'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EMOTION_ANALYSIS } from '../config';

interface EmotionAnalysisProps {
  params: {
    type: string;
  };
}

interface AnalysisResult {
  主要情绪: string;
  情绪分布: {
    [key: string]: number;
  };
  建议: string[];
}

const typeConfig = {
  daily: {
    title: '日常情绪分析',
    description: '通过AI分析您的日常情绪状态，提供个性化调节建议',
    placeholder: '描述一下您今天的心情和遇到的事情...',
    icon: '🌈',
    color: 'blue'
  },
  work: {
    title: '工作压力分析',
    description: '评估工作压力水平，提供专业的减压方案',
    placeholder: '描述一下您在工作中遇到的压力或困扰...',
    icon: '💼',
    color: 'purple'
  },
  relationship: {
    title: '人际情绪分析',
    description: '分析人际交往中的情绪变化，改善社交关系',
    placeholder: '描述一下您在人际交往中的情绪困扰...',
    icon: '🤝',
    color: 'green'
  },
  family: {
    title: '家庭情绪分析',
    description: '探索家庭关系中的情绪互动，促进家庭和谐',
    placeholder: '描述一下您在家庭关系中的情绪状态...',
    icon: '👨‍👩‍👧‍👦',
    color: 'yellow'
  }
};

export default function EmotionAnalysisPage({ params }: EmotionAnalysisProps) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = typeConfig[params.type as keyof typeof typeConfig];
  
  if (!config) {
    router.push('/emotion-analysis');
    return null;
  }

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/emotion-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          type: params.type
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '分析请求失败');
      }

      setResult(data);
    } catch (error) {
      console.error('情绪分析错误:', error);
      setError(error instanceof Error ? error.message : '情绪分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className={`bg-${config.color}-500 p-8`}>
        <div className="container mx-auto">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="text-white hover:text-white/80 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <span className="mr-2">{config.icon}</span>
                {config.title}
              </h1>
              <p className="text-white/80 mt-2">{config.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 输入区域 */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={config.placeholder}
              className="w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={isAnalyzing}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !input.trim()}
                className={`px-6 py-3 bg-${config.color}-500 text-white rounded-lg hover:bg-${config.color}-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAnalyzing ? '分析中...' : '开始分析'}
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* 分析结果 */}
          {result && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">分析结果</h2>
              
              {/* 主要情绪 */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">主要情绪</h3>
                <div className="inline-block px-4 py-2 bg-blue-500 text-white rounded-full">
                  {result.主要情绪}
                </div>
              </div>

              {/* 情绪分布 */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">情绪分布</h3>
                <div className="space-y-3">
                  {Object.entries(result.情绪分布).map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center">
                      <span className="w-24 text-gray-600">{emotion}</span>
                      <div className="flex-1">
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${config.color}-500`}
                            style={{ width: `${value * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="ml-4 text-gray-600">{Math.round(value * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 调节建议 */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">调节建议</h3>
                <ul className="space-y-3">
                  {result.建议.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`text-${config.color}-500 mr-2`}>•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 注意事项 */}
              <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  注意：此分析结果仅供参考。如果您正在经历严重的情绪困扰，建议及时寻求专业心理咨询师的帮助。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 