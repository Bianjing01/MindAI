// AI聊天配置
export const AI_CONFIG = {
  API_URL: 'https://api.siliconflow.cn/v1/chat/completions',
  API_KEY: process.env.SILICON_FLOW_API_TOKEN,
  MODEL_NAME: 'deepseek-ai/DeepSeek-R1',
  API_CONFIG: {
    temperature: 0.7,
    max_tokens: 800
  }
};

// 系统提示词
export const SYSTEM_PROMPT = `你是一个友好、专业的AI助手。你的目标是：
1. 以友好、自然的方式与用户交谈
2. 提供准确、有帮助的回答
3. 保持对话的连贯性和上下文理解
4. 在适当的时候表达同理心
5. 避免有害或不当的内容

请用简短、清晰的语言回答，保持对话的自然流畅。`;

// 语音配置
export const VOICE_CONFIG = {
  MODEL: 'FunAudioLLM/CosyVoice2-0.5B',
  VOICE: 'alex',
  RESPONSE_FORMAT: 'mp3',
  SPEED: 1.0,
  GAIN: 0
};
