'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { testCategories, healthLevels } from '../config';

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface Dimension {
  id: string;
  name: string;
  questions: number[];
  description: string;
  icon: string;
  score?: number;
}

interface CategoryConfig {
  title: string;
  dimensions: Dimension[];
}

interface TestCategories {
  [key: string]: CategoryConfig;
}

// 所有测评类型通用的问题
const commonQuestions: Question[] = [
  {
    id: 1,
    text: '您对这个方面的重视程度如何？',
    options: ['非常重视', '比较重视', '一般重视', '不太重视']
  },
  {
    id: 2,
    text: '您在这方面投入的时间和精力如何？',
    options: ['投入很多', '投入较多', '一般投入', '较少投入']
  },
  {
    id: 3,
    text: '您对自己在这方面的表现满意吗？',
    options: ['非常满意', '比较满意', '一般满意', '不太满意']
  },
  {
    id: 4,
    text: '您是否经常思考如何在这方面改进？',
    options: ['经常思考', '有时思考', '偶尔思考', '很少思考']
  },
  {
    id: 5,
    text: '您在这方面遇到困难时会怎么做？',
    options: ['积极解决', '寻求帮助', '等待机会', '回避问题']
  },
  {
    id: 6,
    text: '您对这方面的知识了解程度如何？',
    options: ['了解很多', '了解较多', '了解一般', '了解较少']
  },
  {
    id: 7,
    text: '您在这方面的信心如何？',
    options: ['非常有信心', '比较有信心', '一般自信', '不太自信']
  },
  {
    id: 8,
    text: '您会主动寻求这方面的提升吗？',
    options: ['经常寻求', '有时寻求', '偶尔寻求', '很少寻求']
  },
  {
    id: 9,
    text: '您能接受这方面的建议和批评吗？',
    options: ['完全接受', '基本接受', '部分接受', '较难接受']
  },
  {
    id: 10,
    text: '您对这方面的未来规划如何？',
    options: ['有明确规划', '有基本规划', '想法模糊', '没有规划']
  },
  {
    id: 11,
    text: '您在这方面的适应能力如何？',
    options: ['适应很快', '适应较快', '适应一般', '适应较慢']
  },
  {
    id: 12,
    text: '您对这方面的变化持什么态度？',
    options: ['积极接受', '基本接受', '勉强接受', '抗拒变化']
  },
  {
    id: 13,
    text: '您会与他人分享这方面的经验吗？',
    options: ['经常分享', '有时分享', '偶尔分享', '很少分享']
  },
  {
    id: 14,
    text: '您在这方面的压力感如何？',
    options: ['压力很小', '压力适中', '压力较大', '压力很大']
  },
  {
    id: 15,
    text: '您对这方面的期望值如何？',
    options: ['期望很高', '期望适中', '期望一般', '期望较低']
  },
  {
    id: 16,
    text: '您会为这方面制定具体目标吗？',
    options: ['经常制定', '有时制定', '偶尔制定', '很少制定']
  },
  {
    id: 17,
    text: '您在这方面的执行力如何？',
    options: ['执行力强', '执行力好', '执行力一般', '执行力弱']
  },
  {
    id: 18,
    text: '您会反思这方面的得失吗？',
    options: ['经常反思', '有时反思', '偶尔反思', '很少反思']
  },
  {
    id: 19,
    text: '您对这方面的态度如何？',
    options: ['非常积极', '比较积极', '态度一般', '较为消极']
  },
  {
    id: 20,
    text: '您对这方面的投入意愿如何？',
    options: ['非常愿意', '比较愿意', '一般愿意', '不太愿意']
  }
];

export default function TestPage({ params }: { params: { category: string } }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const category = params.category;
  const categoryConfig = (testCategories as TestCategories)[category];

  if (!categoryConfig) {
    return <div>测评类型不存在</div>;
  }

  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-600">加载中...</div>
    </div>;
  }

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < commonQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    const totalScore = answers.reduce((sum, answer) => sum + (3 - answer), 0);
    const maxScore = commonQuestions.length * 3;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage >= 85) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 55) return 'fair';
    if (percentage >= 40) return 'concern';
    return 'warning';
  };

  const calculateDimensionScores = () => {
    return categoryConfig.dimensions.map((dimension: Dimension) => {
      const dimensionAnswers = dimension.questions.map((qId: number) => 
        answers[qId - 1]
      );
      const score = dimensionAnswers.reduce((sum: number, answer: number) => 
        sum + (3 - answer), 0
      );
      const maxScore = dimension.questions.length * 3;
      const percentage = (score / maxScore) * 100;
      return {
        ...dimension,
        score: percentage
      };
    });
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleBack = () => {
    router.push('/test-analysis');
  };

  const handleSaveAndPrint = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('请先登录');
        router.push('/login');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = parseInt(user.id);

      const dimensionScores = calculateDimensionScores();
      const totalScore = Math.round(
        dimensionScores.reduce((sum: number, dim: Dimension) => 
          sum + (dim.score || 0), 0
        ) / categoryConfig.dimensions.length
      );
      
      const response = await fetch('/api/test-results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          category,
          scores: dimensionScores.reduce((acc: { [key: string]: number }, dim: Dimension) => {
            acc[dim.id] = Math.round(dim.score || 0);
            return acc;
          }, {}),
          totalScore,
          suggestions: categoryConfig.dimensions.map((dim: Dimension) => 
            `建议加强${dim.name}方面的发展，${dim.description}`
          )
        })
      });

      if (response.ok) {
        alert('测评结果已保存');
        router.push('/profile');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存测评结果失败:', error);
      alert('保存失败，请重试');
    }
  };

  if (showResult) {
    const level = calculateScore();
    const healthLevel = healthLevels[level as keyof typeof healthLevels];
    const dimensionScores = calculateDimensionScores();
    const totalScore = Math.round(
      dimensionScores.reduce((sum: number, dim: Dimension) => 
        sum + (dim.score || 0), 0
      ) / categoryConfig.dimensions.length
    );

    return (
      <div className="min-h-screen bg-white">
        {/* 顶部标题栏 */}
        <div className="bg-blue-500 p-8">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-white">{categoryConfig.title}报告</h1>
            <p className="text-blue-100 mt-2">基于专业量表的个性化分析与建议</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 总体状况 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6">总体状况</h2>
              <div className={`p-6 rounded-lg ${healthLevel.bgColor} border border-${healthLevel.color.split('-')[1]}-100`}>
                <div className="flex items-center gap-4">
                  <div className={`${healthLevel.bgColor} p-2 rounded-lg`}>
                    <span className="text-2xl">{healthLevel.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">
                        健康等级：{healthLevel.name}
                      </h3>
                      <span className="text-4xl font-bold text-blue-500">
                        {totalScore}%
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{healthLevel.description}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 维度评分 */}
            <section>
              <h2 className="text-2xl font-bold mb-6">维度评分</h2>
              <div className="space-y-6">
                {dimensionScores.map((dimension: Dimension) => (
                  <div key={dimension.id} className="bg-white">
                    <div className="flex items-start gap-4 mb-2">
                      <div className="text-2xl">{dimension.icon}</div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-800">
                            {dimension.name}
                          </h3>
                          <span className="text-blue-500 font-bold">
                            {Math.round(dimension.score || 0)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {dimension.description}
                        </p>
                        <div className="h-2 bg-gray-100 rounded-full mt-2">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${dimension.score || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 个性化建议 */}
            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-6">个性化建议</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">
                  基于您的测评结果，我们建议：
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
                  {categoryConfig.dimensions.map((dim: Dimension) => (
                    <li key={dim.id}>
                      建议加强{dim.name}方面的发展，{dim.description}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 操作按钮 */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                重新测试
              </button>
              <button
                onClick={handleSaveAndPrint}
                className="px-8 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                打印报告
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 bg-gradient-to-r from-blue-400 to-blue-500">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">{categoryConfig.title}</h1>
          <p className="text-blue-100 mt-2">深入了解自我，提升个人发展</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    问题 {currentQuestion + 1} / {commonQuestions.length}
                  </h2>
                  <span className="text-sm text-gray-500">
                    完成度 {Math.round((currentQuestion / commonQuestions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentQuestion / commonQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl text-gray-800 mb-6">
                  {commonQuestions[currentQuestion].text}
                </h3>
                <div className="space-y-4">
                  {commonQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 