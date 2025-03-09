export const AI_CONFIG = {
    // API密钥
    API_KEY: 'sk-jayyywywpetjhswcmwozazhmsvwfinylzuwoigqrjysmfmyw',
    
    // 模型名称
    MODEL_NAME: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
    
    // API URL
    API_URL: 'https://api.siliconflow.cn/v1/chat/completions',
    
    // API配置
    API_CONFIG: {
        temperature: 0.7,
        max_tokens: 800
    }
};

export const systemPrompt = {
    role: "情绪识别与分析助手",
    profile: {
        author: "",
        version: "0.1",
        language: "中文",
        description: "情绪识别与分析助手是一个专业的AI角色，它能够根据用户的描述，识别和分析用户的情绪，并基于分析结果提供个性化的建议。"
    },
    emotions: [
        // 基础情绪
        "快乐", "悲伤", "愤怒", "恐惧", "焦虑",
        // 积极情绪
        "开心", "兴奋", "满足", "喜悦", "自信",
        "骄傲", "期待", "憧憬", "放松", "安心",
        "温暖", "感激", "热情", "友善",
        // 消极情绪
        "沮丧", "失望", "绝望", "痛苦", "紧张",
        "烦躁", "压抑", "疲惫", "孤独", "委屈",
        "嫉妒", "怨恨", "羞愧", "内疚",
        // 中性情绪
        "平静", "平和", "淡然", "专注", "思考",
        "困惑", "惊讶", "怀念"
    ]
};

export const getSystemPrompt = () => {
    return `你是一个情绪分析助手。请分析用户输入的文本，识别其中的情绪，并提供建议。
请直接返回JSON格式的结果，不要包含任何markdown标记或其他格式。

你只能使用以下预定义的情绪词：
${systemPrompt.emotions.join('、')}

严格按照以下JSON格式返回（这是纯JSON，不要添加任何其他内容）：

{
    "mainEmotion": "主要情绪（必须从上述情绪词列表中选择）",
    "emotionBreakdown": {
        "情绪1": 数值,
        "情绪2": 数值,
        "其他": 数值
    },
    "suggestions": [
        "建议1",
        "建议2",
        "建议3"
    ]
}`;
};

export const EMOTION_COLORS: { [key: string]: string } = {
    // 积极情绪
    "快乐": "bg-yellow-500",
    "开心": "bg-yellow-400",
    "兴奋": "bg-orange-500",
    "满足": "bg-green-400",
    "喜悦": "bg-yellow-300",
    "自信": "bg-blue-500",
    "骄傲": "bg-purple-500",
    "期待": "bg-blue-400",
    "憧憬": "bg-indigo-400",
    "放松": "bg-green-300",
    "安心": "bg-teal-400",
    "温暖": "bg-orange-300",
    "感激": "bg-pink-400",
    "热情": "bg-red-400",
    "友善": "bg-green-500",

    // 消极情绪
    "悲伤": "bg-blue-600",
    "愤怒": "bg-red-600",
    "恐惧": "bg-purple-600",
    "焦虑": "bg-orange-600",
    "沮丧": "bg-gray-600",
    "失望": "bg-gray-500",
    "绝望": "bg-gray-700",
    "痛苦": "bg-red-700",
    "紧张": "bg-yellow-600",
    "烦躁": "bg-red-500",
    "压抑": "bg-indigo-600",
    "疲惫": "bg-gray-400",
    "孤独": "bg-blue-700",
    "委屈": "bg-purple-400",
    "嫉妒": "bg-green-600",
    "怨恨": "bg-red-800",
    "羞愧": "bg-pink-600",
    "内疚": "bg-indigo-500",

    // 中性情绪
    "平静": "bg-teal-500",
    "平和": "bg-teal-400",
    "淡然": "bg-blue-300",
    "专注": "bg-indigo-300",
    "思考": "bg-purple-300",
    "困惑": "bg-yellow-500",
    "惊讶": "bg-pink-500",
    "怀念": "bg-blue-400"
};

interface EmotionCategory {
  描述: string;
  表现: string[];
  调节: string[];
}

interface EmotionLevel {
  描述: string;
  建议: string;
}

interface EmotionAnalysisConfig {
  情绪类别: {
    [key: string]: EmotionCategory;
  };
  强度等级: {
    [key: string]: EmotionLevel;
  };
}

export const EMOTION_ANALYSIS: EmotionAnalysisConfig = {
  情绪类别: {
    喜: {
      描述: '喜悦',
      表现: [
        '心情愉悦，精力充沛',
        '容易微笑和大笑',
        '对未来充满期待'
      ],
      调节: [
        '适度分享喜悦',
        '保持平和心态',
        '关注他人感受'
      ]
    },
    怒: {
      描述: '愤怒',
      表现: [
        '情绪激动，容易冲动',
        '身体紧张，心跳加快',
        '言语激烈或沉默'
      ],
      调节: [
        '深呼吸放松',
        '暂时远离刺激源',
        '寻找合适的发泄方式'
      ]
    },
    忧: {
      描述: '忧郁',
      表现: [
        '情绪低落，缺乏动力',
        '容易疲倦和失眠',
        '对事物失去兴趣'
      ],
      调节: [
        '保持规律作息',
        '适度运动',
        '寻求社交支持'
      ]
    },
    思: {
      描述: '思虑',
      表现: [
        '反复思考某个问题',
        '难以做出决定',
        '注意力难以集中'
      ],
      调节: [
        '列出思考清单',
        '设定决策期限',
        '适时寻求建议'
      ]
    },
    恐: {
      描述: '恐惧',
      表现: [
        '感到紧张和不安',
        '回避特定情境',
        '出现身体不适'
      ],
      调节: [
        '渐进式接触',
        '学习放松技巧',
        '建立安全感'
      ]
    }
  },
  强度等级: {
    轻度: {
      描述: '轻微情绪波动',
      建议: '可以通过自我调节缓解'
    },
    中度: {
      描述: '明显情绪困扰',
      建议: '建议寻求心理咨询支持'
    },
    重度: {
      描述: '严重情绪问题',
      建议: '需要及时寻求专业帮助'
    }
  }
}; 