'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EMOTION_ANALYSIS } from './config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EmotionValue {
  描述: string;
  表现: string[];
  调节: string[];
}

interface Stats {
  totalCount: number;
  emotionDistribution: {
    [key: string]: number;
  };
  dailyTrends: Array<{
    date: string;
    score: number;
  }>;
}

const analysisTypes = [
  {
    id: 'daily',
    title: '日常情绪分析',
    description: '分析日常生活中的情绪变化',
    icon: '🌈',
    color: 'blue'
  },
  {
    id: 'work',
    title: '工作压力分析',
    description: '评估工作相关的压力状态',
    icon: '💼',
    color: 'purple'
  },
  {
    id: 'relationship',
    title: '人际情绪分析',
    description: '分析社交关系中的情绪',
    icon: '🤝',
    color: 'green'
  },
  {
    id: 'family',
    title: '家庭情绪分析',
    description: '评估家庭关系中的情绪',
    icon: '👨‍👩‍👧‍👦',
    color: 'yellow'
  }
];

export default function EmotionAnalysis() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('daily');
  const [stats, setStats] = useState<Stats>({
    totalCount: 0,
    emotionDistribution: {},
    dailyTrends: []
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : window.location.origin;

      const response = await fetch(`${baseUrl}/api/emotion-stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (stats.emotionDistribution) {
      // 获取今天的日期
      const today = new Date();
      const date = today.getDate();
      const month = today.getMonth() + 1;
      
      // 创建标签
      const label = `${month}/${date}`;
      
      // 从情绪分布数据中提取各类情绪数量
      const emotionCounts = {
        positive: [
          stats.emotionDistribution['快乐'] || 0,
          stats.emotionDistribution['开心'] || 0,
          stats.emotionDistribution['满足'] || 0,
          stats.emotionDistribution['自信'] || 0,
          stats.emotionDistribution['期待'] || 0
        ].reduce((a, b) => a + b, 0),
        
        neutral: [
          stats.emotionDistribution['中性'] || 0,
          stats.emotionDistribution['其他'] || 0
        ].reduce((a, b) => a + b, 0),
        
        negative: [
          stats.emotionDistribution['悲伤'] || 0,
          stats.emotionDistribution['愤怒'] || 0,
          stats.emotionDistribution['恐惧'] || 0,
          stats.emotionDistribution['焦虑'] || 0,
          stats.emotionDistribution['困惑'] || 0,
          stats.emotionDistribution['紧张'] || 0
        ].reduce((a, b) => a + b, 0)
      };

      // 计算情绪指数（将计数转换为0-100的比例）
      const total = emotionCounts.positive + emotionCounts.neutral + emotionCounts.negative;
      const getEmotionIndex = (count: number) => total > 0 ? Math.round((count / total) * 100) : 0;

      setChartData({
        labels: [label],
        datasets: [
          {
            label: '积极情绪',
            data: [getEmotionIndex(emotionCounts.positive)],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.4,
          },
          {
            label: '中性情绪',
            data: [getEmotionIndex(emotionCounts.neutral)],
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgba(255, 205, 86, 0.5)',
            tension: 0.4,
          },
          {
            label: '消极情绪',
            data: [getEmotionIndex(emotionCounts.negative)],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.4,
          },
        ],
      });
    }
  }, [stats.emotionDistribution]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '当前情绪分布',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: '情绪指数（%）',
        },
      },
      x: {
        title: {
          display: true,
          text: '日期',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-blue-500 p-8">
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
              <h1 className="text-3xl font-bold text-white">情绪分析中心</h1>
              <p className="text-white/80 mt-2">全方位分析和管理您的情绪状态</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 概览卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">总分析次数</h3>
              <div className="text-3xl font-bold text-blue-500">{stats.totalCount}</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">主要情绪</h3>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(stats.emotionDistribution).map(([emotion, count]: [string, number]) => (
                  <div
                    key={emotion}
                    className="flex flex-col items-center p-2 rounded-lg bg-gray-50"
                  >
                    <div className="text-sm text-gray-600">{emotion}</div>
                    <div className="text-lg font-semibold text-blue-500">{count}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">情绪趋势</h3>
              <div className="flex items-end space-x-2 h-20">
                {stats.dailyTrends.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="w-4 bg-blue-500 rounded-t"
                      style={{ height: `${item.score}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-1">{item.date.slice(5)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 分析类型选择 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {analysisTypes.map((type) => (
              <Link
                key={type.id}
                href={`/emotion-analysis/${type.id}`}
                className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
                  selectedType === type.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{type.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{type.title}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 情绪知识库 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">情绪知识库</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(EMOTION_ANALYSIS.情绪类别).map(([key, value]: [string, EmotionValue]) => (
                <div key={key} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{value.描述}</h3>
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium text-gray-700">表现：</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {value.表现.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">调节方法：</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {value.调节.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 情绪趋势图 */}
          <div className="mb-8">
            <Line options={options} data={chartData} />
          </div>

          {/* 情绪分析说明 */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">情绪分析说明</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-[rgb(75,192,192)] rounded-full mr-3"></div>
                  <span>积极情绪：表示乐观、开心、满足等正面情绪状态</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-[rgb(255,205,86)] rounded-full mr-3"></div>
                  <span>中性情绪：表示平静、中立的情绪状态</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-[rgb(255,99,132)] rounded-full mr-3"></div>
                  <span>消极情绪：表示焦虑、沮丧、不安等负面情绪状态</span>
                </li>
              </ul>
              <p className="mt-4 text-gray-600">
                通过分析您的情绪变化趋势，我们可以帮助您更好地了解自己的情绪状态，
                及时调整心理状态，保持积极健康的心态。
              </p>
            </div>
          </div>

          {/* 建议和提醒 */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">建议和提醒</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>保持规律的作息时间，确保充足的睡眠</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>适当运动，释放压力和负面情绪</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>与亲友保持良好沟通，分享心情</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>如果持续感到不适，建议及时寻求专业帮助</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 