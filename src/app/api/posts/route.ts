import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const ANONYMOUS_AVATAR = '/images/anonymous-avatar.png';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const sortBy = searchParams.get('sortBy') || 'latest';
    const userId = searchParams.get('userId');

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popular') {
      orderBy = [
        { comments: { _count: 'desc' } },
        { createdAt: 'desc' }
      ];
    }

    const where = category !== 'all' ? { category } : {};

    const posts = await prisma.post.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            favorites: true
          }
        },
        likes: userId ? {
          where: {
            userId: parseInt(userId)
          }
        } : false,
        favorites: userId ? {
          where: {
            userId: parseInt(userId)
          }
        } : false
      }
    });

    // 处理返回数据
    const processedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      createdAt: post.createdAt,
      viewCount: post.viewCount,
      author: post.isAnonymous ? {
        name: '匿名用户',
        image: ANONYMOUS_AVATAR
      } : {
        name: post.user.name,
        image: post.user.image || ANONYMOUS_AVATAR
      },
      _count: {
        comments: post._count.comments,
        likes: post._count.likes,
        favorites: post._count.favorites
      },
      isLiked: post.likes?.length > 0,
      isFavorited: post.favorites?.length > 0
    }));

    return NextResponse.json(processedPosts);
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    return NextResponse.json(
      { error: '获取帖子列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, category, userId, isAnonymous } = await request.json();

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        image: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 创建帖子
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        userId,
        isAnonymous: isAnonymous || false,
        authorName: user.name // 保存作者名字
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

    // 处理返回数据
    const processedPost = {
      ...post,
      author: isAnonymous ? {
        name: '匿名用户',
        image: ANONYMOUS_AVATAR
      } : {
        name: post.user.name,
        image: post.user.image || ANONYMOUS_AVATAR
      }
    };

    // 删除敏感信息
    delete (processedPost as any).user;

    return NextResponse.json(processedPost);
  } catch (error) {
    console.error('创建帖子失败:', error);
    return NextResponse.json(
      { error: '创建帖子失败' },
      { status: 500 }
    );
  }
} 