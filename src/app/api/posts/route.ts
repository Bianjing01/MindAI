import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'latest';

    let where = {};
    if (category && category !== 'all') {
      where = { category };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popular') {
      orderBy = { likes: 'desc' };
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        status: true,
        authorName: true,
        likes: true,
        comments: true,
        views: true,
        createdAt: true,
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: '获取帖子失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, authorName = '匿名用户' } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        authorName,
        status: '',
        likes: 0,
        comments: 0,
        views: 0,
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: '发布帖子失败' },
      { status: 500 }
    );
  }
} 