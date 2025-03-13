import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, avatarUrl } = await request.json();

    // 更新用户头像
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(userId)
      },
      data: {
        image: avatarUrl,
        avatar: avatarUrl // 同时更新两个字段以保持一致性
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    });

    // 更新本地存储中的用户信息
    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('更新头像失败:', error);
    return NextResponse.json(
      { success: false, error: '更新头像失败' },
      { status: 500 }
    );
  }
} 