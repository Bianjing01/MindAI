import { NextResponse } from 'next/server';
import { AI_CONFIG } from '@/app/ai-chat/config';
import { SYSTEM_PROMPT } from '@/app/ai-chat/config';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // 调用Silicon Flow API进行对话
    const response = await fetch(AI_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SILICON_FLOW_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_CONFIG.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: message
          }
        ],
        ...AI_CONFIG.API_CONFIG
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Silicon Flow API Error:', errorData);
      throw new Error('AI服务调用失败');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
}