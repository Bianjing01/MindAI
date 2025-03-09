import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true,
        _count: {
          select: { comments: true }
        }
      }
    });

    // 转换数据格式
    const formattedPosts = posts.map(post => ({
      ...post,
      comments: post._count.comments
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('获取用户帖子失败:', error);
    return NextResponse.json(
      { error: '获取用户帖子失败' },
      { status: 500 }
    );
  }
} 