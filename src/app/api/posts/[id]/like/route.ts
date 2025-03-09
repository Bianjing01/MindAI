import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '无效的帖子ID' },
        { status: 400 }
      );
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        likes: {
          increment: 1
        }
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('点赞失败:', error);
    return NextResponse.json(
      { error: '点赞失败' },
      { status: 500 }
    );
  }
} 