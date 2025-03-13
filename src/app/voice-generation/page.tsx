'use client';

import { useState, useRef } from 'react';
import { VOICE_CONFIG } from '../ai-chat/config';

export default function VoiceGenerationPage() {
  const [model, setModel] = useState(VOICE_CONFIG.MODEL);
  const [voice, setVoice] = useState(VOICE_CONFIG.VOICE);
  const [speed, setSpeed] = useState(VOICE_CONFIG.SPEED);
  const [gain, setGain] = useState(VOICE_CONFIG.GAIN);
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const voices = [
    { id: 'alex', name: 'Alex', desc: '沉稳男声' },
    { id: 'anna', name: 'Anna', desc: '沉稳女声' },
    { id: 'bella', name: 'Bella', desc: '激情女声' },
    { id: 'benjamin', name: 'Benjamin', desc: '低沉男声' },
    { id: 'charles', name: 'Charles', desc: '磁性男声' },
    { id: 'claire', name: 'Claire', desc: '温柔女声' },
    { id: 'david', name: 'David', desc: '欢快男声' },
    { id: 'diana', name: 'Diana', desc: '欢快女声' }
  ];

  const generateVoice = async () => {
    if (!text.trim()) return;
    
    try {
      setIsGenerating(true);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          speed,
          gain,
          voice
        }),
      });

      if (!response.ok) {
        throw new Error('语音生成失败');
      }

      const audioBlob = await response.blob();
      // 如果存在之前的音频URL，释放它
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
      }
      const audioUrl = URL.createObjectURL(audioBlob);
      setCurrentAudioUrl(audioUrl);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('语音生成错误:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceChange = async (newVoice: string) => {
    setVoice(newVoice);
    if (text.trim() && !isGenerating) {
      // 等待状态更新后再生成语音
      setTimeout(() => {
        generateVoice();
      }, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 标题 */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-purple-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-medium">语音生成</h1>
        </div>

        {/* 音频播放器 */}
        <audio ref={audioRef} className="w-full" controls />

        {/* 音色选择 */}
        <div className="grid grid-cols-2 gap-4">
          {voices.map((v) => (
            <button
              key={v.id}
              onClick={() => handleVoiceChange(v.id)}
              className={`p-4 rounded-lg border transition-all ${
                voice === v.id
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <div className="text-left">
                <div className="font-medium">{v.name}</div>
                <div className="text-sm text-gray-500">{v.desc}</div>
              </div>
            </button>
          ))}
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

        {/* 文本输入 */}
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="请输入要转换的文本..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* 生成按钮 */}
        <button
          onClick={generateVoice}
          disabled={isGenerating || !text.trim()}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
            isGenerating || !text.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-600'
          }`}
        >
          {isGenerating ? '生成中...' : '生成语音'}
        </button>
      </div>
    </div>
  );
} 