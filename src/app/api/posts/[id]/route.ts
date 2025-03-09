import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
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

    // 获取帖子并增加浏览量
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: '帖子不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
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