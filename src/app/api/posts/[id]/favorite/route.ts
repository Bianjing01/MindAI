import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    const { userId } = await request.json();

    // 检查是否已经收藏
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingFavorite) {
      // 如果已经收藏，则取消收藏
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return NextResponse.json({ favorited: false });
    } else {
      // 如果未收藏，则添加收藏
      await prisma.favorite.create({
        data: {
          postId,
          userId,
        },
      });
      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error('处理收藏失败:', error);
    return NextResponse.json({ error: '处理收藏失败' }, { status: 500 });
  }
} 