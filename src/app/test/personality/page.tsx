'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    id: 1,
    text: '过去两周内，您感到心情低落、沮丧或绝望的频率是？',
    options: ['完全没有', '有几天', '超过一周', '几乎每天']
  },
  {
    id: 2,
    text: '您对日常活动失去兴趣或乐趣的程度是？',
    options: ['没有变化', '轻微', '中等', '严重']
  },
  {
    id: 3,
    text: '您的睡眠质量如何？',
    options: ['很好', '一般', '较差', '非常差']
  },
  {
    id: 4,
    text: '您感到疲劳或精力不足的频率是？',
    options: ['很少', '偶尔', '经常', '总是']
  },
  {
    id: 5,
    text: '您对自己的评价如何？',
    options: ['很满意', '基本满意', '不太满意', '非常不满意']
  },
  {
    id: 6,
    text: '您的食欲状况如何？',
    options: ['正常', '略有减少', '明显减少', '完全没有胃口']
  },
  {
    id: 7,
    text: '您是否经常感到焦虑或紧张？',
    options: ['从不', '偶尔', '经常', '总是']
  },
  {
    id: 8,
    text: '您的注意力集中程度如何？',
    options: ['很好', '一般', '较差', '无法集中']
  },
  {
    id: 9,
    text: '您是否有过自伤或轻生的想法？',
    options: ['从未有过', '偶尔有', '经常有', '总是有']
  },
  {
    id: 10,
    text: '您与家人朋友的关系如何？',
    options: ['非常融洽', '一般', '有些紧张', '非常紧张']
  },
  {
    id: 11,
    text: '您对未来的看法如何？',
    options: ['充满希望', '一般', '有些消极', '完全绝望']
  },
  {
    id: 12,
    text: '您的工作或学习效率如何？',
    options: ['很高', '一般', '较低', '无法工作/学习']
  },
  {
    id: 13,
    text: '您是否容易感到烦躁或易怒？',
    options: ['从不', '偶尔', '经常', '总是']
  },
  {
    id: 14,
    text: '您的社交活动频率如何？',
    options: ['经常参与', '偶尔参与', '很少参与', '完全不参与']
  },
  {
    id: 15,
    text: '您是否经常感到孤独？',
    options: ['从不', '偶尔', '经常', '总是']
  },
  {
    id: 16,
    text: '您对生活的满意度如何？',
    options: ['非常满意', '基本满意', '不太满意', '非常不满意']
  },
  {
    id: 17,
    text: '您是否有身体上的不适感？',
    options: ['没有', '轻微', '中等', '严重']
  },
  {
    id: 18,
    text: '您的情绪波动程度如何？',
    options: ['很稳定', '偶尔波动', '经常波动', '剧烈波动']
  },
  {
    id: 19,
    text: '您是否能够享受生活中的乐趣？',
    options: ['完全能', '部分能', '很少能', '完全不能']
  },
  {
    id: 20,
    text: '您的压力应对能力如何？',
    options: ['很好', '一般', '较差', '无法应对']
  }
];

// 定义维度
const dimensions = [
  {
    id: 'emotion',
    name: '情绪状态',
    questions: [1, 7, 13, 18], // 关联的问题ID
    description: '评估您的情绪稳定性和心情变化情况',
    icon: '😊'
  },
  {
    id: 'life',
    name: '生活质量',
    questions: [2, 6, 14, 19],
    description: '评估您的日常生活质量和满意度',
    icon: '🌟'
  },
  {
    id: 'physical',
    name: '身心健康',
    questions: [3, 4, 8, 17],
    description: '评估您的身体状况和精神状态',
    icon: '💪'
  },
  {
    id: 'social',
    name: '社交关系',
    questions: [10, 14, 15],
    description: '评估您的人际关系和社交状况',
    icon: '🤝'
  },
  {
    id: 'mental',
    name: '心理韧性',
    questions: [5, 11, 16, 20],
    description: '评估您应对压力和挑战的能力',
    icon: '🎯'
  }
];

// 健康等级定义
const healthLevels = {
  excellent: {
    name: '优秀',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: '您的心理健康状况非常好，请继续保持积极乐观的生活态度！',
    icon: '🌟'
  },
  good: {
    name: '良好',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '您的心理健康状况良好，建议继续保持并适当提升。',
    icon: '👍'
  },
  fair: {
    name: '一般',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: '您的心理健康状况一般，建议关注自我调节和心理健康。',
    icon: '⚠️'
  },
  concern: {
    name: '需要关注',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: '您的心理健康状况需要关注，建议及时寻求专业的心理咨询帮助。',
    icon: '⚡'
  },
  warning: {
    name: '需要帮助',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: '您的心理健康状况需要重点关注，强烈建议尽快寻求专业心理医生的帮助。',
    icon: '🆘'
  }
};

export default function PersonalityTest() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    const totalScore = answers.reduce((sum, answer) => sum + (3 - answer), 0);
    const maxScore = questions.length * 3;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage >= 85) return 'excellent';
    if (percentage >= 70) return 'good';
    if (percentage >= 55) return 'fair';
    if (percentage >= 40) return 'concern';
    return 'warning';
  };

  const calculateDimensionScores = () => {
    return dimensions.map(dimension => {
      const dimensionAnswers = dimension.questions.map(qId => 
        answers[qId - 1]
      );
      const score = dimensionAnswers.reduce((sum, answer) => 
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
      const userId = parseInt(user.id); // 确保转换为整数

      const dimensionScores = calculateDimensionScores();
      const totalScore = Math.round(
        dimensionScores.reduce((sum, dim) => sum + dim.score, 0) / dimensions.length
      );
      
      const response = await fetch('/api/test-results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          category: 'personality',
          scores: dimensionScores.reduce((acc: { [key: string]: number }, dim) => {
            acc[dim.id] = Math.round(dim.score);
            return acc;
          }, {}),
          totalScore,
          suggestions: [
            '多与孩子进行有效沟通，倾听他们的想法和感受',
            '在教育方式上保持耐心和适度，避免过分严厉',
            '增加与孩子的互动时间，参与他们的学习和娱乐',
            '尊重孩子的个性发展，给予适当的自主空间',
            '关注孩子的情绪变化，及时给予情感支持'
          ]
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
    const healthLevel = healthLevels[level];
    const dimensionScores = calculateDimensionScores();
    const totalScore = Math.round(
      dimensionScores.reduce((sum, dim) => sum + dim.score, 0) / dimensions.length
    );

    return (
      <div className="min-h-screen bg-white">
        {/* 顶部标题栏 */}
        <div className="bg-blue-500 p-8">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-white">性格情绪评估报告</h1>
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
                  <div className={`bg-${healthLevel.color.split('-')[1]}-100 p-2 rounded-lg`}>
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
                {dimensionScores.map(dimension => (
                  <div key={dimension.id} className="bg-white">
                    <div className="flex items-start gap-4 mb-2">
                      <div className="text-2xl">{dimension.icon}</div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-800">
                            {dimension.name}
                          </h3>
                          <span className="text-blue-500 font-bold">
                            {Math.round(dimension.score)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {dimension.description}
                        </p>
                        <div className="h-2 bg-gray-100 rounded-full mt-2">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${dimension.score}%` }}
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
                  <li>注意调节情绪，保持心理健康</li>
                  <li>培养积极的生活态度和兴趣爱好</li>
                  <li>加强自我认知，发展个人潜能</li>
                  <li>保持良好的作息和生活习惯</li>
                  <li>适时寻求专业的心理咨询支持</li>
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
      <div className="py-8 bg-gradient-to-r from-purple-400 to-purple-500">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">性格情绪测试</h1>
          <p className="text-purple-100 mt-2">评估性格特征，了解情绪状态</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    问题 {currentQuestion + 1} / {questions.length}
                  </h2>
                  <span className="text-sm text-gray-500">
                    完成度 {Math.round((currentQuestion / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl text-gray-800 mb-6">
                  {questions[currentQuestion].text}
                </h3>
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
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