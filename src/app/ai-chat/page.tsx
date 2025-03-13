'use client';

import { useState, useEffect, useRef } from 'react';
import useVoiceRecorder from '../hooks/useVoiceRecorder';
import { VOICE_CONFIG } from './config';

export default function AIChatPage() {
  const [messages, setMessages] = useState<Array<{text: string, isAI: boolean}>>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentVoice, setCurrentVoice] = useState(VOICE_CONFIG.VOICE);
  const [speed, setSpeed] = useState(VOICE_CONFIG.SPEED);
  const [gain, setGain] = useState(VOICE_CONFIG.GAIN);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const voices = [
    { id: 'alex', name: 'Alex' },
    { id: 'anna', name: 'Anna' },
    { id: 'bella', name: 'Bella' },
    { id: 'benjamin', name: 'Benjamin' },
    { id: 'charles', name: 'Charles' },
    { id: 'claire', name: 'Claire' },
    { id: 'david', name: 'David' },
    { id: 'diana', name: 'Diana' }
  ];

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
        body: JSON.stringify({ 
          text,
          voice: currentVoice,
          speed,
          gain
        }),
      });

      if (!response.ok) {
        throw new Error('语音生成失败');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Audio playback error:', error);
        }
        
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

  const { startRecording, stopRecording, getAudioBlob } = useVoiceRecorder();
  
  const handleVoiceRecording = async () => {
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
      const audioBlob = getAudioBlob();
      if (audioBlob) {
        setIsProcessing(true);
        try {
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
      setIsRecording(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* 顶部导航栏 */}
        <div className="flex items-center space-x-2 mb-4">
          <button className="p-2 hover:bg-purple-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-medium">语音生成</h1>
        </div>

        <div className="grid grid-cols-[300px,1fr] gap-4">
          {/* 左侧控制面板 */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            {/* Model 选择 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <div className="relative">
                <input
                  type="text"
                  value={VOICE_CONFIG.MODEL}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            {/* 倍速调节 */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">倍速</label>
                <input
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-20 p-2 border border-gray-300 rounded-lg text-right"
                  step="0.1"
                  min="0.5"
                  max="2.0"
                />
              </div>
              <input
                type="range"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-purple-500"
                min="0.5"
                max="2.0"
                step="0.1"
              />
            </div>

            {/* 音量增益调节 */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">音量增益 (dB)</label>
                <input
                  type="number"
                  value={gain}
                  onChange={(e) => setGain(Number(e.target.value))}
                  className="w-20 p-2 border border-gray-300 rounded-lg text-right"
                  step="1"
                  min="-10"
                  max="10"
                />
              </div>
              <input
                type="range"
                value={gain}
                onChange={(e) => setGain(Number(e.target.value))}
                className="w-full accent-purple-500"
                min="-10"
                max="10"
                step="1"
              />
            </div>

            {/* 音色选择 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">音色</label>
              <div className="relative">
                <select
                  value={currentVoice}
                  onChange={(e) => setCurrentVoice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {voices.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 右侧聊天区域 */}
          <div className="bg-white rounded-lg shadow-sm flex flex-col">
            {/* 聊天记录 */}
            <div className="flex-1 p-4 overflow-y-auto">
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

            {/* 输入区域 */}
            <div className="border-t p-4">
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
                  placeholder="请输入..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isRecording}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isRecording || !inputText.trim()}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isRecording || !inputText.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  发送
                </button>
              </div>
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
    </div>
  );
}
