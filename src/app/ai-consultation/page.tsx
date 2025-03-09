'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AI_CONFIG, SYSTEM_PROMPT, QUICK_QUESTIONS } from './config';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

// 清理markdown格式的函数
const cleanMarkdown = (text: string): string => {
  return text
    .replace(/#{1,6}\s?/g, '') // 移除标题标记
    .replace(/\*\*/g, '') // 移除加粗标记
    .replace(/\*/g, '') // 移除斜体标记
    .replace(/`{1,3}/g, '') // 移除代码块标记
    .replace(/>/g, '') // 移除引用标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 转换链接为纯文本
    .replace(/\n\s*[-+*]\s/g, '\n') // 移除列表标记
    .replace(/```[a-z]*\n/g, '') // 移除代码块语言标记
    .replace(/```/g, '') // 移除代码块结束标记
    .trim(); // 清理首尾空白
};

export default function AiConsultation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 初始化加载时发送系统消息
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '您好！我是您的AI心理健康顾问。我很感谢您愿意与我分享您的想法和感受。请告诉我，最近您过得怎么样？',
        timestamp: formatTime()
      }]);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const sendMessage = async (content: string, isInitial: boolean = false) => {
    if (!isInitial && !content.trim()) return;

    if (!isInitial) {
      // 添加用户消息
      setMessages(prev => [...prev, {
        role: 'user',
        content: content.trim(),
        timestamp: formatTime()
      }]);
      setInput('');
    }

    setIsTyping(true);

    try {
      const response = await fetch(AI_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.API_KEY}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.MODEL_NAME,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            ...(isInitial ? [] : [{
              role: "user",
              content: content.trim()
            }])
          ],
          ...AI_CONFIG.API_CONFIG
        })
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();
      const aiResponse = cleanMarkdown(data.choices[0].message.content);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: formatTime()
      }]);
    } catch (error) {
      console.error('AI响应错误:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，我现在无法回应，请稍后再试。',
        timestamp: formatTime()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 返回
            </button>
            <h1 className="text-xl font-semibold text-gray-900">AI心理咨询</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 聊天区域 */}
          <div className="bg-white rounded-lg shadow-lg mb-4">
            <div className="h-[500px] overflow-y-auto p-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === 'user' ? 'flex flex-row-reverse' : 'flex'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.role === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center text-gray-500 text-sm">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  AI正在思考...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 快速问题 */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question)}
                  disabled={isTyping}
                  className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* 输入区域 */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您想咨询的问题..."
                className="flex-1 resize-none border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                disabled={isTyping}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isTyping || !input.trim()}
                className={`ml-4 px-6 py-3 rounded-lg text-white transition-colors ${
                  isTyping || !input.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                发送
              </button>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>注意：这是一个AI辅助系统，仅供参考。如果遇到严重的心理问题，请及时寻求专业心理医生的帮助。</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .typing-indicator {
          display: inline-flex;
          align-items: center;
          margin-right: 4px;
        }
        .typing-indicator span {
          width: 4px;
          height: 4px;
          margin: 0 1px;
          background-color: #6b7280;
          border-radius: 50%;
          animation: typing 1s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}