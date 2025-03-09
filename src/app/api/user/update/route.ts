import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id, name, image } = await request.json();
    
    // 确保将id转换为整数
    const userId = parseInt(id);
    
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name,
        image
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return NextResponse.json(
      { error: '更新用户信息失败' },
      { status: 500 }
    );
  }
} 