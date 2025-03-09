'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    id: 1,
    text: '您与配偶的沟通频率如何？',
    options: ['每天多次', '每天一次', '偶尔', '很少']
  },
  {
    id: 2,
    text: '您们能平和地处理分歧吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 3,
    text: '您们会一起规划未来吗？',
    options: ['经常会', '有时会', '偶尔会', '很少会']
  },
  {
    id: 4,
    text: '您对目前的婚姻生活满意度如何？',
    options: ['非常满意', '比较满意', '一般', '不太满意']
  },
  {
    id: 5,
    text: '您们能互相理解对方的感受吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 6,
    text: '您们会一起分担家务吗？',
    options: ['总是会', '经常会', '偶尔会', '很少会']
  },
  {
    id: 7,
    text: '您们能保持良好的情感交流吗？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 8,
    text: '您们会一起参与共同的活动吗？',
    options: ['经常会', '有时会', '偶尔会', '很少会']
  },
  {
    id: 9,
    text: '您们能互相尊重对方的个人空间吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 10,
    text: '您们在重要决定上能达成共识吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 11,
    text: '您们会表达对彼此的关心吗？',
    options: ['经常会', '有时会', '偶尔会', '很少会']
  },
  {
    id: 12,
    text: '您们能互相支持对方的事业发展吗？',
    options: ['完全支持', '基本支持', '一般', '较少支持']
  },
  {
    id: 13,
    text: '您们在经济问题上的配合度如何？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 14,
    text: '您们能妥善处理与双方家庭的关系吗？',
    options: ['非常好', '较好', '一般', '较差']
  },
  {
    id: 15,
    text: '您们的生活习惯契合度如何？',
    options: ['非常契合', '比较契合', '一般', '不太契合']
  },
  {
    id: 16,
    text: '您们能互相信任对方吗？',
    options: ['完全信任', '基本信任', '一般', '不太信任']
  },
  {
    id: 17,
    text: '您们在教育子女问题上的一致性如何？',
    options: ['非常一致', '基本一致', '偶有分歧', '经常分歧']
  },
  {
    id: 18,
    text: '您们能保持适度的浪漫吗？',
    options: ['经常能', '有时能', '偶尔能', '很少能']
  },
  {
    id: 19,
    text: '您们能互相包容对方的缺点吗？',
    options: ['总是能', '经常能', '偶尔能', '很少能']
  },
  {
    id: 20,
    text: '您们对未来的婚姻生活充满期待吗？',
    options: ['非常期待', '比较期待', '一般', '不太期待']
  }
];

const dimensions = [
  {
    id: 'communication',
    name: '沟通交流',
    questions: [1, 5, 7, 11],
    description: '评估夫妻间的沟通质量和频率',
    icon: '💬'
  },
  {
    id: 'cooperation',
    name: '协作配合',
    questions: [6, 10, 13, 17],
    description: '评估夫妻间的配合度和默契程度',
    icon: '🤝'
  },
  {
    id: 'emotional',
    name: '情感联系',
    questions: [4, 16, 18, 19],
    description: '评估夫妻间的情感维系状况',
    icon: '❤️'
  },
  {
    id: 'life',
    name: '生活融合',
    questions: [8, 12, 14, 15],
    description: '评估夫妻间的生活契合度',
    icon: '🏠'
  },
  {
    id: 'future',
    name: '未来发展',
    questions: [3, 9, 12, 20],
    description: '评估夫妻对未来的共同规划',
    icon: '🎯'
  }
];

const healthLevels = {
  excellent: {
    name: '和谐',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: '您的婚姻关系非常和谐，继续保持这份美好的感情！',
    icon: '🌟'
  },
  good: {
    name: '稳定',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '您的婚姻关系稳定良好，仍有提升的空间。',
    icon: '👍'
  },
  fair: {
    name: '一般',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: '您的婚姻关系处于中等水平，需要更多关注和维护。',
    icon: '⚠️'
  },
  concern: {
    name: '需要关注',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: '您的婚姻关系需要更多关注，建议寻求婚姻咨询。',
    icon: '⚡'
  },
  warning: {
    name: '需要改善',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: '您的婚姻关系亟需改善，强烈建议寻求专业的婚姻咨询服务。',
    icon: '🆘'
  }
};

export default function MarriageTest() {
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
      
      // 保存测评结果到数据库
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          category: 'marriage',
          scores: dimensionScores.reduce((acc: { [key: string]: number }, dim) => {
            acc[dim.id] = Math.round(dim.score);
            return acc;
          }, {}),
          totalScore,
          details: `婚恋测评结果：总分 ${totalScore}分\n` + 
            Object.entries(dimensionScores)
              .map(([dimension, score]) => `${dimension}: ${score}分`)
              .join('\n')
        }),
      });

      if (!response.ok) {
        throw new Error('保存测评结果失败');
      }

      // 打印报告
      window.print();
    } catch (error) {
      console.error('保存测评结果失败:', error);
      alert('保存测评结果失败，请重试');
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
            <h1 className="text-3xl font-bold text-white">婚姻情感评估报告</h1>
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
                        关系等级：{healthLevel.name}
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
                  <li>加强情感沟通和理解</li>
                  <li>培养共同兴趣和爱好</li>
                  <li>建立健康的亲密关系</li>
                  <li>学会处理矛盾和分歧</li>
                  <li>保持适度的个人空间</li>
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
      <div className="py-8 bg-gradient-to-r from-pink-400 to-pink-500">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">婚姻情感测试</h1>
          <p className="text-pink-100 mt-2">评估婚恋关系，促进感情和谐</p>
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
                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
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
                      className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-colors"
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