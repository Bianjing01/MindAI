import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, category, scores, totalScore, suggestions } = await request.json();

    // 确保将userId转换为整数
    const userIdInt = parseInt(userId);

    // 将详细信息转换为JSON字符串
    const details = JSON.stringify({
      scores,
      suggestions
    });

    const result = await prisma.testResult.create({
      data: {
        userId: userIdInt,
        category,
        scores,
        totalScore,
        details,
      }
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