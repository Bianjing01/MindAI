import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;

    if (!audioBlob) {
      throw new Error('没有收到音频数据');
    }

    // 创建新的 FormData 对象发送到 Silicon Flow API
    const apiFormData = new FormData();
    apiFormData.append('file', audioBlob, 'audio.wav');
    apiFormData.append('model', 'whisper');
    apiFormData.append('language', 'zh');

    const response = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SILICON_FLOW_API_TOKEN}`
      },
      body: apiFormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Speech to Text API Error:', errorData);
      throw new Error('语音识别失败');
    }

    const data = await response.json();
    return NextResponse.json({ text: data.text });

  } catch (error) {
    console.error('Speech to Text API Error:', error);
    return NextResponse.json(
      { error: '语音识别失败' },
      { status: 500 }
    );
  }
} 