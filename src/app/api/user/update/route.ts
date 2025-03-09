import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const name = formData.get('name') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl = undefined;
    if (imageFile) {
      // 这里需要实现文件上传逻辑，可以使用云存储服务如 AWS S3 或其他服务
      // 为了示例，这里假设我们已经获得了图片URL
      imageUrl = '/uploads/' + imageFile.name;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        ...(imageUrl && { image: imageUrl }),
      },
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