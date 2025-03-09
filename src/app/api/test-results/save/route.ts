import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, category, scores, suggestions } = data;

    // 计算总分
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

    const result = await prisma.testResult.create({
      data: {
        userId: parseInt(userId),
        category,
        score: totalScore,
        details: JSON.stringify({
          scores,
          suggestions,
          date: new Date().toISOString(),
        }),
        createdAt: new Date(),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('保存测评结果失败:', error);
    return NextResponse.json(
      { error: '保存测评结果失败' },
      { status: 500 }
    );
  }
} 