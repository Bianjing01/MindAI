import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // TODO: 在这里集成实际的AI服务
    // 目前返回一个简单的回复用于测试
    const aiResponse = `我收到了您的消息："${message}"。这是一个测试回复。`;

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 