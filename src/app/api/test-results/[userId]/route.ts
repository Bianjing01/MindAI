import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    // 获取用户的所有测评结果
    const results = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      distinct: ['category'],
    });

    // 将结果转换为前端需要的格式
    const formattedResults = results.reduce((acc, result) => {
      const details = JSON.parse(result.details);
      acc[result.category] = {
        category: result.category,
        totalScore: result.totalScore,
        date: result.createdAt.toISOString(),
        details: details.suggestions.join('\n'),
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('获取测评结果失败:', error);
    return NextResponse.json(
      { error: '获取测评结果失败' },
      { status: 500 }
    );
  }
} 