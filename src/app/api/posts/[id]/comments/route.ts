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

    const { content, authorName } = await request.json();

    // 验证输入
    if (!content?.trim() || !authorName?.trim()) {
      return NextResponse.json(
        { error: '评论内容和昵称不能为空' },
        { status: 400 }
      );
    }

    // 创建评论并更新帖子评论数
    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          content,
          authorName,
          postId
        }
      }),
      prisma.post.update({
        where: { id: postId },
        data: {
          comments: {
            increment: 1
          }
        }
      })
    ]);

    return NextResponse.json(comment);
  } catch (error) {
    console.error('发表评论失败:', error);
    return NextResponse.json(
      { error: '发表评论失败' },
      { status: 500 }
    );
  }
}

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

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('获取评论失败:', error);
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    );
  }
} 