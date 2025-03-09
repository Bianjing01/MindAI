'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    id: 1,
    text: '您能理解孩子的想法和感受吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 2,
    text: '您会花时间陪伴孩子学习和玩耍吗？',
    options: ['每天都会', '经常会', '偶尔会', '很少会']
  },
  {
    id: 3,
    text: '当孩子犯错时，您会如何处理？',
    options: ['耐心沟通', '适度批评', '严厉惩罚', '忽视不管']
  },
  {
    id: 4,
    text: '您对孩子的学习成绩要求如何？',
    options: ['因材施教', '适度期望', '要求较高', '过分严格']
  },
  {
    id: 5,
    text: '您会倾听孩子的想法和建议吗？',
    options: ['总是会', '经常会', '偶尔会', '很少会']
  },
  {
    id: 6,
    text: '您能控制自己的情绪不对孩子发脾气吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 7,
    text: '您会关注孩子的心理健康吗？',
    options: ['非常关注', '比较关注', '一般关注', '很少关注']
  },
  {
    id: 8,
    text: '您会尊重孩子的隐私吗？',
    options: ['完全尊重', '基本尊重', '偶尔干涉', '经常干涉']
  },
  {
    id: 9,
    text: '您会和孩子分享自己的经历和感受吗？',
    options: ['经常分享', '有时分享', '很少分享', '从不分享']
  },
  {
    id: 10,
    text: '您能接受孩子的不完美吗？',
    options: ['完全接受', '基本接受', '勉强接受', '难以接受']
  },
  {
    id: 11,
    text: '您会给予孩子独立思考和决策的机会吗？',
    options: ['经常给予', '有时给予', '很少给予', '从不给予']
  },
  {
    id: 12,
    text: '您会关注孩子的兴趣爱好吗？',
    options: ['非常关注', '比较关注', '一般关注', '不太关注']
  },
  {
    id: 13,
    text: '您会和孩子进行有效沟通吗？',
    options: ['经常沟通', '有时沟通', '很少沟通', '几乎不沟通']
  },
  {
    id: 14,
    text: '您会以身作则给孩子做好榜样吗？',
    options: ['总是会', '经常会', '偶尔会', '很少会']
  },
  {
    id: 15,
    text: '您会关注孩子的社交发展吗？',
    options: ['非常关注', '比较关注', '一般关注', '不太关注']
  },
  {
    id: 16,
    text: '您会帮助孩子建立自信心吗？',
    options: ['经常帮助', '有时帮助', '很少帮助', '从不帮助']
  },
  {
    id: 17,
    text: '您会尊重孩子的选择吗？',
    options: ['完全尊重', '基本尊重', '偶尔尊重', '很少尊重']
  },
  {
    id: 18,
    text: '您会关注孩子的情绪变化吗？',
    options: ['非常关注', '比较关注', '一般关注', '不太关注']
  },
  {
    id: 19,
    text: '您会给予孩子适当的表扬和鼓励吗？',
    options: ['经常给予', '有时给予', '很少给予', '从不给予']
  },
  {
    id: 20,
    text: '您会帮助孩子制定合理的目标吗？',
    options: ['经常帮助', '有时帮助', '很少帮助', '从不帮助']
  }
];

const dimensions = [
  {
    id: 'communication',
    name: '沟通互动',
    questions: [1, 5, 9, 13],
    description: '评估与孩子的沟通质量和频率',
    icon: '💬'
  },
  {
    id: 'education',
    name: '教育方式',
    questions: [3, 4, 14, 20],
    description: '评估教育孩子的方法和态度',
    icon: '📚'
  },
  {
    id: 'emotional',
    name: '情感支持',
    questions: [6, 7, 18, 19],
    description: '评估对孩子的情感关怀程度',
    icon: '❤️'
  },
  {
    id: 'respect',
    name: '尊重理解',
    questions: [8, 10, 11, 17],
    description: '评估对孩子的尊重和理解程度',
    icon: '🤝'
  },
  {
    id: 'companionship',
    name: '陪伴关注',
    questions: [2, 12, 15, 16],
    description: '评估对孩子的陪伴和关注程度',
    icon: '🌟'
  }
];

const healthLevels = {
  excellent: {
    name: '优秀',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: '您的亲子关系非常和谐，继续保持这种良好的互动方式！',
    icon: '🌟'
  },
  good: {
    name: '良好',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '您的亲子关系总体良好，仍有提升的空间。',
    icon: '👍'
  },
  fair: {
    name: '一般',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: '您的亲子关系处于中等水平，需要更多关注和改善。',
    icon: '⚠️'
  },
  concern: {
    name: '需要关注',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: '您的亲子关系需要更多关注，建议寻求家庭教育指导。',
    icon: '⚡'
  },
  warning: {
    name: '需要改善',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: '您的亲子关系亟需改善，建议尽快寻求专业的家庭咨询服务。',
    icon: '🆘'
  }
};

export default function ParentChildTest() {
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
          category: 'parent-child',
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
            <h1 className="text-3xl font-bold text-white">亲子关系评估报告</h1>
            <p className="text-blue-100 mt-2">基于专业量表的个性化分析与建议</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 总体状况 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6">总体状况</h2>
              <div className={`p-6 rounded-lg bg-${healthLevel.color.split('-')[1]}-50 border border-${healthLevel.color.split('-')[1]}-100`}>
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
                  <li>多与孩子进行有效沟通，倾听他们的想法和感受</li>
                  <li>在教育方式上保持耐心和适度，避免过分严厉</li>
                  <li>增加与孩子的互动时间，参与他们的学习和娱乐</li>
                  <li>尊重孩子的个性发展，给予适当的自主空间</li>
                  <li>关注孩子的情绪变化，及时给予情感支持</li>
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
          <h1 className="text-4xl font-bold text-white">亲子教育测试</h1>
          <p className="text-blue-100 mt-2">深入了解亲子关系模式，提升教育效果</p>
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
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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