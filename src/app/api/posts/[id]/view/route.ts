import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);

    // 增加浏览量
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ viewCount: post.viewCount });
  } catch (error) {
    console.error('更新浏览量失败:', error);
    return NextResponse.json({ error: '更新浏览量失败' }, { status: 500 });
  }
} 