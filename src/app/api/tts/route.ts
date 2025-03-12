import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // 使用 speech API 生成语音
    const response = await fetch('https://api.siliconflow.cn/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SILICON_FLOW_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "FunAudioLLM/CosyVoice2-0.5B",
        voice: "FunAudioLLM/CosyVoice2-0.5B:bella", // 使用系统预置音色
        input: text,
        response_format: "mp3",
        speed: 1.0,
        gain: 0
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