'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    id: 1,
    text: '您的睡眠质量如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 2,
    text: '您每周运动的频率是？',
    options: ['4次以上', '2-3次', '1次', '几乎不运动']
  },
  {
    id: 3,
    text: '您的饮食规律性如何？',
    options: ['非常规律', '较规律', '一般', '不规律']
  },
  {
    id: 4,
    text: '您的工作压力水平如何？',
    options: ['很小', '一般', '较大', '很大']
  },
  {
    id: 5,
    text: '您的身体灵活度如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 6,
    text: '您的饮食结构是否均衡？',
    options: ['非常均衡', '较均衡', '一般', '不均衡']
  },
  {
    id: 7,
    text: '您的精力充沛程度如何？',
    options: ['总是充沛', '经常充沛', '一般', '经常疲惫']
  },
  {
    id: 8,
    text: '您的免疫力如何？',
    options: ['很强', '较强', '一般', '较弱']
  },
  {
    id: 9,
    text: '您的体重控制情况如何？',
    options: ['非常理想', '基本合适', '略有偏差', '严重偏差']
  },
  {
    id: 10,
    text: '您的心肺功能如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 11,
    text: '您的作息时间规律吗？',
    options: ['非常规律', '较规律', '一般', '不规律']
  },
  {
    id: 12,
    text: '您的水分摄入情况如何？',
    options: ['充足', '较充足', '一般', '不足']
  },
  {
    id: 13,
    text: '您的视力保护情况如何？',
    options: ['很注意', '较注意', '一般', '不太注意']
  },
  {
    id: 14,
    text: '您的关节灵活度如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 15,
    text: '您的消化功能如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 16,
    text: '您的皮肤状况如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 17,
    text: '您的牙齿保健情况如何？',
    options: ['很注意', '较注意', '一般', '不太注意']
  },
  {
    id: 18,
    text: '您的颈椎/腰椎状况如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 19,
    text: '您的血压状况如何？',
    options: ['非常稳定', '较稳定', '偶有波动', '经常波动']
  },
  {
    id: 20,
    text: '您定期体检的频率是？',
    options: ['每年都做', '隔年做', '偶尔做', '几乎不做']
  }
];

const dimensions = [
  {
    id: 'lifestyle',
    name: '生活方式',
    questions: [1, 3, 11, 12],
    description: '评估日常生活习惯的健康程度',
    icon: '🌞'
  },
  {
    id: 'physical',
    name: '身体机能',
    questions: [5, 10, 14, 18],
    description: '评估身体各项机能的状况',
    icon: '💪'
  },
  {
    id: 'nutrition',
    name: '营养状况',
    questions: [6, 9, 12, 15],
    description: '评估营养摄入和消化情况',
    icon: '🥗'
  },
  {
    id: 'exercise',
    name: '运动健康',
    questions: [2, 5, 8, 14],
    description: '评估运动习惯和体能状况',
    icon: '🏃'
  },
  {
    id: 'maintenance',
    name: '健康维护',
    questions: [13, 16, 17, 20],
    description: '评估日常保健和预防意识',
    icon: '❤️'
  }
];

const healthLevels = {
  excellent: {
    name: '优秀',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: '您的身体健康状况非常好，请继续保持良好的生活习惯！',
    icon: '🌟'
  },
  good: {
    name: '良好',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '您的身体健康状况良好，建议继续保持并适当改善。',
    icon: '👍'
  },
  fair: {
    name: '一般',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: '您的身体健康状况一般，需要更多关注和改善。',
    icon: '⚠️'
  },
  concern: {
    name: '需要关注',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: '您的身体健康状况需要关注，建议及时进行健康检查。',
    icon: '⚡'
  },
  warning: {
    name: '需要改善',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: '您的身体健康状况需要改善，建议尽快就医检查。',
    icon: '🆘'
  }
};

export default function HealthTest() {
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
          category: 'health',
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
            <h1 className="text-3xl font-bold text-white">健康状况评估报告</h1>
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
                  <li>保持规律的作息时间和生活习惯</li>
                  <li>坚持适度运动，增强体质</li>
                  <li>注意营养均衡，保持健康饮食</li>
                  <li>定期体检，预防疾病</li>
                  <li>保持良好的心理状态</li>
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
      <div className="py-8 bg-gradient-to-r from-red-400 to-red-500">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">健康评定测试</h1>
          <p className="text-red-100 mt-2">全面评估身心健康状况</p>
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
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
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
                      className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors"
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