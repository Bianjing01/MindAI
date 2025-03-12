'use client';

import { useState, useEffect, useRef } from 'react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

export default function AIChatPage() {
  const [messages, setMessages] = useState<Array<{text: string, isAI: boolean}>>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isRecording, startRecording, stopRecording, getAudioBlob } = useVoiceRecorder();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateVoice = async (text: string) => {
    try {
      setIsGeneratingVoice(true);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('语音生成失败');
      }

      // 获取音频 blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Audio playback error:', error);
        }
        
        // 播放完成后释放 URL
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.error('语音生成错误:', error);
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const newMessage = { text: inputText, isAI: false };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        throw new Error('API请求失败');
      }

      const data = await response.json();
      const aiResponse = { text: data.response, isAI: true };
      setMessages(prev => [...prev, aiResponse]);
      
      // 为AI回复生成语音
      await generateVoice(data.response);
    } catch (error) {
      console.error('发送消息时出错:', error);
      const errorMessage = { text: "抱歉，处理您的消息时出现了错误。请稍后重试。", isAI: true };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      stopRecording();
      const audioBlob = getAudioBlob();
      if (audioBlob) {
        setIsProcessing(true);
        try {
          // 创建临时消息显示录音状态
          const tempMessage = { text: "正在识别语音...", isAI: true };
          setMessages(prev => [...prev, tempMessage]);

          // 发送音频数据到语音识别 API
          const formData = new FormData();
          formData.append('audio', audioBlob);

          const response = await fetch('/api/stt', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('语音识别失败');
          }

          const data = await response.json();
          
          // 移除临时消息
          setMessages(prev => prev.filter(msg => msg !== tempMessage));

          // 添加用户的语音转文字消息
          const userMessage = { text: data.text, isAI: false };
          setMessages(prev => [...prev, userMessage]);

          // 发送识别出的文字到 AI 进行对话
          const aiResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: data.text }),
          });

          if (!aiResponse.ok) {
            throw new Error('AI 对话请求失败');
          }

          const aiData = await aiResponse.json();
          const aiMessage = { text: aiData.response, isAI: true };
          setMessages(prev => [...prev, aiMessage]);
          
          // 为 AI 回复生成语音
          await generateVoice(aiData.response);

        } catch (error) {
          console.error('语音处理错误:', error);
          const errorMessage = { text: "抱歉，语音识别失败，请重试。", isAI: true };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsProcessing(false);
        }
      }
    } else {
      await startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 p-4 text-white">
          <h1 className="text-xl font-bold text-center">AI 通话助手</h1>
          <p className="text-sm text-center mt-1 text-blue-100">支持文字和语音对话</p>
          <div className="mt-2 text-center">
            <span className="text-sm bg-blue-600 px-2 py-1 rounded">CosyVoice2</span>
          </div>
        </div>

        {/* Messages Container */}
        <div className="h-[calc(100vh-240px)] overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isAI ? 'justify-start' : 'justify-end'} mb-4`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isAI
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <div className="flex items-center">
                  <span>{message.text}</span>
                  {message.isAI && (
                    <button
                      onClick={() => generateVoice(message.text)}
                      className="ml-2 text-xs opacity-50 hover:opacity-100 transition-opacity"
                      disabled={isGeneratingVoice}
                    >
                      {isGeneratingVoice ? '🔄' : '🔊'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white">
          <div className="flex space-x-2">
            <button
              onClick={handleVoiceRecording}
              className={`p-2 rounded-full ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-200'
              } hover:opacity-80 transition-colors`}
              title={isRecording ? "点击停止录音" : "点击开始录音"}
            >
              <span className="text-xl">{isRecording ? '⏺' : '🎤'}</span>
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入消息..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
              disabled={isRecording}
            />
            <button
              onClick={handleSendMessage}
              disabled={isRecording || !inputText.trim()}
              className={`px-4 py-2 rounded-full transition-colors ${
                isRecording || !inputText.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              发送
            </button>
          </div>
        </div>
      </div>
      
      {/* Audio element for playing TTS */}
      <audio 
        ref={audioRef} 
        className="fixed bottom-0 left-0 w-full"
        controls
        style={{ height: '40px', display: isGeneratingVoice ? 'block' : 'none' }}
      />
    </div>
  );
} 