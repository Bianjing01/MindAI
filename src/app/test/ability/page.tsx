'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    id: 1,
    text: '您能快速理解和掌握新知识吗？',
    options: ['非常容易', '比较容易', '一般', '比较困难']
  },
  {
    id: 2,
    text: '您能有效地规划和管理时间吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 3,
    text: '您能在压力下保持冷静和高效工作吗？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 4,
    text: '您能快速适应新的工作环境和要求吗？',
    options: ['非常快', '较快', '一般', '较慢']
  },
  {
    id: 5,
    text: '您能独立解决工作中的问题吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 6,
    text: '您的团队协作能力如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 7,
    text: '您能清晰地表达自己的想法吗？',
    options: ['非常清晰', '较清晰', '一般', '不太清晰']
  },
  {
    id: 8,
    text: '您能有效地处理多项任务吗？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 9,
    text: '您的创新思维能力如何？',
    options: ['非常强', '较强', '一般', '较弱']
  },
  {
    id: 10,
    text: '您能积极主动地承担责任吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 11,
    text: '您的决策能力如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 12,
    text: '您能有效地进行资源整合吗？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 13,
    text: '您的抗压能力如何？',
    options: ['非常强', '较强', '一般', '较弱']
  },
  {
    id: 14,
    text: '您的学习主动性如何？',
    options: ['非常高', '较高', '一般', '较低']
  },
  {
    id: 15,
    text: '您能准确识别问题的关键点吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 16,
    text: '您的执行力如何？',
    options: ['非常强', '较强', '一般', '较弱']
  },
  {
    id: 17,
    text: '您能妥善处理人际关系吗？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 18,
    text: '您的信息收集和分析能力如何？',
    options: ['非常强', '较强', '一般', '较弱']
  },
  {
    id: 19,
    text: '您能及时调整工作策略吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 20,
    text: '您的目标达成能力如何？',
    options: ['非常强', '较强', '一般', '较弱']
  }
];

const dimensions = [
  {
    id: 'learning',
    name: '学习能力',
    questions: [1, 14, 18, 19],
    description: '评估知识获取和应用能力',
    icon: '📚'
  },
  {
    id: 'execution',
    name: '执行能力',
    questions: [2, 8, 16, 20],
    description: '评估任务完成和目标实现能力',
    icon: '✨'
  },
  {
    id: 'thinking',
    name: '思维能力',
    questions: [9, 11, 15, 18],
    description: '评估分析问题和创新思维能力',
    icon: '🧠'
  },
  {
    id: 'teamwork',
    name: '协作能力',
    questions: [6, 7, 12, 17],
    description: '评估团队合作和沟通能力',
    icon: '🤝'
  },
  {
    id: 'adaptation',
    name: '适应能力',
    questions: [3, 4, 13, 19],
    description: '评估环境适应和压力应对能力',
    icon: '🔄'
  }
];

const healthLevels = {
  excellent: {
    name: '卓越',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: '您展现出优秀的综合能力，继续保持并挑战自我！',
    icon: '🌟'
  },
  good: {
    name: '优秀',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '您的各项能力表现良好，仍有提升空间。',
    icon: '👍'
  },
  fair: {
    name: '良好',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: '您的能力水平处于良好水平，需要继续努力。',
    icon: '⚠️'
  },
  concern: {
    name: '待提升',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: '您的部分能力需要提升，建议有针对性地进行培养。',
    icon: '⚡'
  },
  warning: {
    name: '需加强',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: '您的多项能力需要加强，建议制定详细的提升计划。',
    icon: '🆘'
  }
};

export default function AbilityTest() {
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
          category: 'ability',
          scores: dimensionScores.reduce((acc: { [key: string]: number }, dim) => {
            acc[dim.id] = Math.round(dim.score);
            return acc;
          }, {}),
          totalScore,
          suggestions: [
            '建立清晰的职业发展规划，设定短期和长期目标',
            '持续学习新技能，保持知识更新和能力提升',
            '主动寻求具有挑战性的项目和任务',
            '培养跨领域协作能力，提升团队合作效率',
            '注重时间管理，提高工作效率和质量',
            '保持开放学习的心态，接受新观点和方法',
            '定期进行自我评估，找出需要改进的领域'
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
            <h1 className="text-3xl font-bold text-white">个人能力评估报告</h1>
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
                        能力等级：{healthLevel.name}
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
                  <li>制定明确的学习和发展计划</li>
                  <li>加强时间管理和任务规划能力</li>
                  <li>培养创新思维和问题解决能力</li>
                  <li>提升团队协作和沟通技巧</li>
                  <li>增强抗压能力和适应性</li>
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
      <div className="py-8 bg-gradient-to-r from-green-400 to-green-500">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">个人能力测试</h1>
          <p className="text-green-100 mt-2">评估个人潜力，发现发展方向</p>
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
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
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
                      className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
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