import { NextResponse } from 'next/server';
import { AI_CONFIG } from '@/app/ai-consultation/config';
import { EMOTION_ANALYSIS } from '@/app/emotion-analysis/config';

// 清理AI响应中的markdown标记
function cleanMarkdown(text: string): string {
  // 移除markdown代码块标记
  text = text.replace(/```json\n?/g, '');
  text = text.replace(/```\n?/g, '');
  // 移除可能的其他markdown标记
  text = text.replace(/\*\*/g, '');
  text = text.replace(/\*/g, '');
  text = text.replace(/`/g, '');
  // 移除多余的空行
  text = text.trim();
  return text;
}

export async function POST(request: Request) {
  try {
    const { text, type } = await request.json();

    // 调用AI接口进行情绪分析
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
            content: `你是一个专业的情绪分析AI助手。请分析用户的文本，识别其中的情绪状态，并给出相应的建议。
            请严格按照以下JSON格式返回（不要添加任何其他内容，不要使用markdown格式）：
            {
              "mainEmotion": "主要情绪",
              "emotionBreakdown": {
                "情绪1": 0.6,
                "情绪2": 0.3,
                "其他": 0.1
              },
              "suggestions": [
                "建议1",
                "建议2",
                "建议3"
              ]
            }`
          },
          {
            role: "user",
            content: `分析以下文本的情绪状态：${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error('AI服务请求失败');
    }

    const aiResponse = await response.json();
    const cleanedContent = cleanMarkdown(aiResponse.choices[0].message.content);
    
    try {
      const analysisResult = JSON.parse(cleanedContent);
      
      // 更新统计数据
      await fetch('/api/emotion-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainEmotion: analysisResult.mainEmotion,
          emotionBreakdown: analysisResult.emotionBreakdown,
        }),
      });

      return NextResponse.json({
        主要情绪: analysisResult.mainEmotion,
        情绪分布: analysisResult.emotionBreakdown,
        建议: analysisResult.suggestions
      });
    } catch (parseError) {
      console.error('JSON解析错误:', parseError);
      console.log('清理后的内容:', cleanedContent);
      return NextResponse.json(
        { error: '情绪分析结果格式错误' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('情绪分析错误:', error);
    return NextResponse.json(
      { error: '情绪分析失败，请稍后重试' },
      { status: 500 }
    );
  }
} 