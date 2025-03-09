import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    const comments = await prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        postId: true,
        post: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('获取用户评论失败:', error);
    return NextResponse.json(
      { error: '获取用户评论失败' },
      { status: 500 }
    );
  }
} 