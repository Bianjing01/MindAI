import { NextResponse } from 'next/server';
import { VOICE_CONFIG } from '@/app/ai-chat/config';

export async function POST(request: Request) {
  try {
    const { text, voice = VOICE_CONFIG.VOICE, speed = VOICE_CONFIG.SPEED, gain = VOICE_CONFIG.GAIN } = await request.json();

    // 使用 speech API 生成语音
    const response = await fetch('https://api.siliconflow.cn/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SILICON_FLOW_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: VOICE_CONFIG.MODEL,
        voice: `${VOICE_CONFIG.MODEL}:${voice}`,  // 使用前端传递的 voice 参数
        input: text,
        response_format: VOICE_CONFIG.RESPONSE_FORMAT,
        speed: speed,
        gain: gain
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Silicon Flow API Error:', errorData);
      throw new Error('语音生成API调用失败');
    }

    // 获取音频数据
    const audioBuffer = await response.arrayBuffer();
    
    // 返回音频数据和类型
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString()
      }
    });

  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json(
      { error: '语音生成失败' },
      { status: 500 }
    );
  }
}