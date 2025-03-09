import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const ANONYMOUS_AVATAR = '/images/anonymous-avatar.png';

// 获取评论列表
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(params.id)
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 处理匿名评论
    const processedComments = comments.map(comment => ({
      ...comment,
      author: comment.isAnonymous ? {
        name: '匿名用户',
        image: ANONYMOUS_AVATAR
      } : {
        name: comment.user.name,
        image: comment.user.image || ANONYMOUS_AVATAR
      }
    }));

    // 删除原始的 user 字段
    processedComments.forEach(comment => {
      delete (comment as any).user;
    });

    return NextResponse.json(processedComments);
  } catch (error) {
    console.error('获取评论失败:', error);
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    );
  }
}

// 创建新评论
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { content, userId, isAnonymous } = await request.json();

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(params.id),
        userId,
        isAnonymous: isAnonymous || false
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    // 处理匿名评论
    const processedComment = {
      ...comment,
      author: isAnonymous ? {
        name: '匿名用户',
        image: ANONYMOUS_AVATAR
      } : {
        name: comment.user.name,
        image: comment.user.image || ANONYMOUS_AVATAR
      }
    };

    // 删除原始的 user 字段
    delete (processedComment as any).user;

    return NextResponse.json(processedComment);
  } catch (error) {
    console.error('创建评论失败:', error);
    return NextResponse.json(
      { error: '创建评论失败' },
      { status: 500 }
    );
  }
} 