import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(params.id)
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      );
    }

    // 处理匿名帖子
    const processedPost = {
      ...post,
      author: post.isAnonymous ? {
        name: '匿名用户',
        image: '/default-avatar.png'
      } : {
        name: post.user.name,
        image: post.user.image || '/default-avatar.png'
      }
    };

    // 删除原始的 user 字段
    delete (processedPost as any).user;

    return NextResponse.json(processedPost);
  } catch (error) {
    console.error('获取帖子失败:', error);
    return NextResponse.json(
      { error: '获取帖子失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // 删除帖子
    await prisma.post.delete({
      where: { id: postId }
    });

    return NextResponse.json({ message: '帖子已删除' });
  } catch (error) {
    console.error('删除帖子失败:', error);
    return NextResponse.json(
      { error: '删除帖子失败' },
      { status: 500 }
    );
  }
} 