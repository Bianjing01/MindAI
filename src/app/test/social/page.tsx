'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    id: 1,
    text: '您是否容易与陌生人建立联系？',
    options: ['非常容易', '比较容易', '一般', '比较困难']
  },
  {
    id: 2,
    text: '您能在社交场合自如地表达自己吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 3,
    text: '您能理解他人的情绪和需求吗？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 4,
    text: '您在团体活动中的参与度如何？',
    options: ['非常积极', '比较积极', '一般', '较少参与']
  },
  {
    id: 5,
    text: '您能妥善处理人际冲突吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 6,
    text: '您会主动维护社交关系吗？',
    options: ['经常会', '有时会', '偶尔会', '很少会']
  },
  {
    id: 7,
    text: '您在社交场合感到焦虑的频率是？',
    options: ['从不', '偶尔', '经常', '总是']
  },
  {
    id: 8,
    text: '您能倾听他人的想法和感受吗？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 9,
    text: '您能在团队中发挥领导作用吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 10,
    text: '您能接受不同观点和意见吗？',
    options: ['完全能', '基本能', '一般', '较难']
  },
  {
    id: 11,
    text: '您能在社交中保持真实的自我吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 12,
    text: '您会主动帮助他人吗？',
    options: ['经常会', '有时会', '偶尔会', '很少会']
  },
  {
    id: 13,
    text: '您能建立长期稳定的友谊吗？',
    options: ['非常容易', '比较容易', '一般', '比较困难']
  },
  {
    id: 14,
    text: '您在社交中的情绪控制能力如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 15,
    text: '您能感知社交场合的氛围吗？',
    options: ['非常敏锐', '比较敏锐', '一般', '不太敏锐']
  },
  {
    id: 16,
    text: '您会主动参与社交活动吗？',
    options: ['经常会', '有时会', '偶尔会', '很少会']
  },
  {
    id: 17,
    text: '您能在社交中展现幽默感吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 18,
    text: '您能维持健康的人际边界吗？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 19,
    text: '您在社交网络中的活跃度如何？',
    options: ['非常活跃', '比较活跃', '一般', '较少参与']
  },
  {
    id: 20,
    text: '您能在社交中展现同理心吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  }
];

const dimensions = [
  {
    id: 'communication',
    name: '沟通能力',
    questions: [2, 8, 15, 17],
    description: '评估语言表达和倾听能力',
    icon: '💬'
  },
  {
    id: 'empathy',
    name: '共情能力',
    questions: [3, 10, 18, 20],
    description: '评估理解和关心他人的能力',
    icon: '❤️'
  },
  {
    id: 'interaction',
    name: '互动能力',
    questions: [1, 4, 6, 16],
    description: '评估社交互动的主动性和适应性',
    icon: '🤝'
  },
  {
    id: 'emotional',
    name: '情绪管理',
    questions: [7, 11, 14, 18],
    description: '评估社交场合的情绪控制能力',
    icon: '😊'
  },
  {
    id: 'relationship',
    name: '关系维护',
    questions: [5, 12, 13, 19],
    description: '评估建立和维护人际关系的能力',
    icon: '🌟'
  }
];

const healthLevels = {
  excellent: {
    name: '优秀',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: '您具备出色的社交能力，能够轻松建立和维护人际关系！',
    icon: '🌟'
  },
  good: {
    name: '良好',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '您的社交能力表现良好，在大多数场合都能自如应对。',
    icon: '👍'
  },
  fair: {
    name: '一般',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: '您的社交能力处于中等水平，还需要进一步提升。',
    icon: '⚠️'
  },
  concern: {
    name: '需要关注',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: '您的社交能力需要提升，建议多参与社交活动。',
    icon: '⚡'
  },
  warning: {
    name: '需要改善',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: '您的社交能力需要显著提升，建议寻求专业指导。',
    icon: '🆘'
  }
};

export default function SocialTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();

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
          category: 'social',
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
            <h1 className="text-3xl font-bold text-white">人际社交评估报告</h1>
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
                        社交等级：{healthLevel.name}
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
                  <li>培养积极主动的社交态度</li>
                  <li>提升沟通表达和倾听能力</li>
                  <li>增强情绪管理和共情能力</li>
                  <li>建立和维护良好的人际关系</li>
                  <li>参与更多社交活动，扩展社交圈</li>
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
      <div className="py-8 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">人际社交测试</h1>
          <p className="text-yellow-100 mt-2">评估社交能力，改善人际关系</p>
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
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
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
                      className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
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