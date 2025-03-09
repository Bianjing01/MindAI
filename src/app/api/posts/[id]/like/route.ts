import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    const { userId } = await request.json();

    // 检查是否已经点赞
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      // 如果已经点赞，则取消点赞
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ liked: false });
    } else {
      // 如果未点赞，则添加点赞
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('处理点赞失败:', error);
    return NextResponse.json({ error: '处理点赞失败' }, { status: 500 });
  }
} 