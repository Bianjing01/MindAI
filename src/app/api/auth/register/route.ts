import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // 检查邮箱是否已被注册
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 对密码进行加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        image: '/default-avatar.png' // 设置默认头像
      }
    });

    // 返回成功消息
    return NextResponse.json({ message: '注册成功' });
    
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    );
  }
} 