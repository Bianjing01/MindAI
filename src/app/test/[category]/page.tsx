'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const categoryConfig = {
  'parent-child': {
    title: '亲子关系测评',
    dimensions: {
      '沟通互动': '评估与孩子的沟通质量和频率',
      '教育方式': '评估教育孩子的方法和态度',
      '情感支持': '评估对孩子的情感关怀程度',
      '尊重理解': '评估对孩子的尊重和理解程度',
      '陪伴关注': '评估对孩子的陪伴和关注程度',
    },
  },
  'personality': {
    title: '性格测评',
    dimensions: {
      '开放性': '评估对新事物的接受程度',
      '责任心': '评估做事的认真负责程度',
      '外向性': '评估社交活跃程度',
      '亲和性': '评估与他人相处的和谐程度',
      '情绪稳定性': '评估情绪控制能力',
    },
  },
  'ability': {
    title: '能力测评',
    dimensions: {
      '学习能力': '评估知识获取和应用能力',
      '创造力': '评估创新思维能力',
      '执行力': '评估任务完成能力',
      '分析能力': '评估问题分析能力',
      '表达能力': '评估沟通表达能力',
    },
  },
  'social': {
    title: '社交能力测评',
    dimensions: {
      '人际交往': '评估社交互动能力',
      '情感表达': '评估情感传达能力',
      '团队合作': '评估团队协作能力',
      '冲突处理': '评估矛盾解决能力',
      '社交主动性': '评估社交积极性',
    },
  },
  'marriage': {
    title: '婚恋测评',
    dimensions: {
      '情感投入': '评估感情投入程度',
      '沟通质量': '评估双方沟通效果',
      '价值观契合': '评估三观一致程度',
      '生活适应': '评估共同生活适应度',
      '未来规划': '评估对未来的共同期望',
    },
  },
  'health': {
    title: '心理健康测评',
    dimensions: {
      '情绪管理': '评估情绪调节能力',
      '压力应对': '评估压力处理能力',
      '自我认知': '评估自我了解程度',
      '生活满意度': '评估生活质量评价',
      '心理韧性': '评估心理承受能力',
    },
  },
};

export default function TestResult({ params }: { params: { category: string } }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // 这里可以根据实际测评结果设置分数
    // 现在使用示例数据
    const config = categoryConfig[params.category as keyof typeof categoryConfig];
    if (config) {
      const initialScores = Object.keys(config.dimensions).reduce((acc, key) => {
        acc[key] = 67; // 示例分数
        return acc;
      }, {} as Record<string, number>);
      setScores(initialScores);

      // 根据测评类型设置建议
      setSuggestions(generateSuggestions(params.category));
    }
  }, [params.category]);

  const generateSuggestions = (category: string) => {
    // 根据不同类型返回不同的建议
    const suggestionMap = {
      'parent-child': [
        '多与孩子进行有效沟通，倾听他们的想法和感受',
        '在教育方式上保持耐心和适度，避免过分严厉',
        '增加与孩子的互动时间，参与他们的学习和娱乐',
        '尊重孩子的个性发展，给予适当的自主空间',
        '关注孩子的情绪变化，及时给予情感支持',
      ],
      'personality': [
        '培养开放思维，尝试接受新事物',
        '提高做事的责任心和计划性',
        '适度参与社交活动，扩展人际圈',
        '保持友善态度，提升人际和谐度',
        '学习情绪管理，保持心态平和',
      ],
      // ... 其他类型的建议
    };
    return suggestionMap[category as keyof typeof suggestionMap] || [];
  };

  const handleSaveAndPrint = async () => {
    try {
      setSaving(true);
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        router.push('/auth/login');
        return;
      }

      const userInfo = JSON.parse(savedUser);
      
      // 保存测评结果
      const response = await fetch('/api/test-results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.id,
          category: params.category,
          scores,
          suggestions,
        }),
      });

      if (response.ok) {
        // 打印报告
        window.print();
        // 保存成功后跳转到个人资料页面
        router.push('/profile');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存测评结果失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const config = categoryConfig[params.category as keyof typeof categoryConfig];
  if (!config) {
    return <div>无效的测评类型</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">{config.title}</h1>
        
        {/* 维度评分展示 */}
        {Object.entries(scores).map(([dimension, score]) => (
          <div key={dimension} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-gray-700">{dimension}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {config.dimensions[dimension as keyof typeof config.dimensions]}
                </span>
              </div>
              <span className="text-blue-600">{score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        ))}

        {/* 个性化建议 */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">个性化建议</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">基于您的测评结果，我们建议：</p>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/test-analysis')}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            重新测试
          </button>
          <button
            onClick={handleSaveAndPrint}
            disabled={saving}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {saving ? '保存中...' : '打印报告'}
          </button>
        </div>
      </div>
    </div>
  );
} 