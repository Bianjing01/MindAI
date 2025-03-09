export const testCategories = {
  'parent-child': {
    title: '亲子关系测评',
    dimensions: [
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
    ]
  },
  'personality': {
    title: '性格测评',
    dimensions: [
      {
        id: 'openness',
        name: '开放性',
        questions: [1, 6, 11, 16],
        description: '评估对新经验的接受程度',
        icon: '🌈'
      },
      {
        id: 'conscientiousness',
        name: '尽责性',
        questions: [2, 7, 12, 17],
        description: '评估做事的认真负责程度',
        icon: '📝'
      },
      {
        id: 'extraversion',
        name: '外向性',
        questions: [3, 8, 13, 18],
        description: '评估社交活跃程度',
        icon: '🎭'
      },
      {
        id: 'agreeableness',
        name: '宜人性',
        questions: [4, 9, 14, 19],
        description: '评估与他人相处的和谐程度',
        icon: '🤗'
      },
      {
        id: 'neuroticism',
        name: '情绪稳定性',
        questions: [5, 10, 15, 20],
        description: '评估情绪的稳定程度',
        icon: '😊'
      }
    ]
  },
  'ability': {
    title: '能力倾向测评',
    dimensions: [
      {
        id: 'logical',
        name: '逻辑思维',
        questions: [1, 6, 11, 16],
        description: '评估分析和解决问题的能力',
        icon: '🧩'
      },
      {
        id: 'creative',
        name: '创造力',
        questions: [2, 7, 12, 17],
        description: '评估创新和想象力水平',
        icon: '💡'
      },
      {
        id: 'practical',
        name: '实践能力',
        questions: [3, 8, 13, 18],
        description: '评估实际操作和执行能力',
        icon: '🛠️'
      },
      {
        id: 'learning',
        name: '学习能力',
        questions: [4, 9, 14, 19],
        description: '评估获取和应用新知识的能力',
        icon: '📚'
      },
      {
        id: 'communication',
        name: '沟通表达',
        questions: [5, 10, 15, 20],
        description: '评估语言表达和交流能力',
        icon: '💬'
      }
    ]
  },
  'social': {
    title: '社交能力测评',
    dimensions: [
      {
        id: 'empathy',
        name: '同理心',
        questions: [1, 6, 11, 16],
        description: '评估理解他人感受的能力',
        icon: '❤️'
      },
      {
        id: 'communication',
        name: '沟通能力',
        questions: [2, 7, 12, 17],
        description: '评估与他人交流的效果',
        icon: '💬'
      },
      {
        id: 'leadership',
        name: '领导力',
        questions: [3, 8, 13, 18],
        description: '评估组织和影响他人的能力',
        icon: '👑'
      },
      {
        id: 'cooperation',
        name: '团队合作',
        questions: [4, 9, 14, 19],
        description: '评估在团队中工作的能力',
        icon: '🤝'
      },
      {
        id: 'adaptation',
        name: '适应能力',
        questions: [5, 10, 15, 20],
        description: '评估适应新环境的能力',
        icon: '🌱'
      }
    ]
  },
  'marriage': {
    title: '婚恋观测评',
    dimensions: [
      {
        id: 'values',
        name: '价值观',
        questions: [1, 6, 11, 16],
        description: '评估对婚姻的基本认知和期望',
        icon: '💫'
      },
      {
        id: 'emotion',
        name: '情感需求',
        questions: [2, 7, 12, 17],
        description: '评估情感表达和需求满足',
        icon: '❤️'
      },
      {
        id: 'responsibility',
        name: '责任意识',
        questions: [3, 8, 13, 18],
        description: '评估对家庭责任的承担',
        icon: '🤝'
      },
      {
        id: 'communication',
        name: '沟通方式',
        questions: [4, 9, 14, 19],
        description: '评估处理关系中的沟通能力',
        icon: '💬'
      },
      {
        id: 'future',
        name: '未来规划',
        questions: [5, 10, 15, 20],
        description: '评估对未来生活的规划能力',
        icon: '🎯'
      }
    ]
  },
  'health': {
    title: '心理健康测评',
    dimensions: [
      {
        id: 'emotion',
        name: '情绪管理',
        questions: [1, 6, 11, 16],
        description: '评估管理和调节情绪的能力',
        icon: '😊'
      },
      {
        id: 'stress',
        name: '压力应对',
        questions: [2, 7, 12, 17],
        description: '评估处理压力的能力',
        icon: '🌊'
      },
      {
        id: 'satisfaction',
        name: '生活满意度',
        questions: [3, 8, 13, 18],
        description: '评估对生活的整体满意程度',
        icon: '⭐'
      },
      {
        id: 'relationship',
        name: '人际关系',
        questions: [4, 9, 14, 19],
        description: '评估社交关系的健康程度',
        icon: '🤝'
      },
      {
        id: 'growth',
        name: '个人成长',
        questions: [5, 10, 15, 20],
        description: '评估自我提升和发展能力',
        icon: '🌱'
      }
    ]
  }
};

export const healthLevels = {
  excellent: {
    name: '优秀',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: '您的表现非常出色，继续保持！',
    icon: '🌟'
  },
  good: {
    name: '良好',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '您的表现良好，仍有提升空间。',
    icon: '👍'
  },
  fair: {
    name: '一般',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: '您的表现处于中等水平，需要更多关注和改善。',
    icon: '⚠️'
  },
  concern: {
    name: '需要关注',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: '您的表现需要更多关注，建议寻求指导。',
    icon: '⚡'
  },
  warning: {
    name: '需要改善',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: '您的表现亟需改善，建议尽快寻求专业帮助。',
    icon: '🆘'
  }
}; 