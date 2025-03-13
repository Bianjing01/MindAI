import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: '没有文件上传' },
        { status: 400 }
      );
    }

    // 获取文件扩展名
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    
    if (!allowedTypes.includes(ext)) {
      return NextResponse.json(
        { success: false, error: '不支持的文件类型' },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `avatar-${uniqueSuffix}.${ext}`;
    
    // 确保上传目录存在
    const uploadDir = join(process.cwd(), 'public/uploads');
    
    // 将文件写入服务器
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    // 返回文件URL
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({
      success: true,
      url
    });
    
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { success: false, error: '文件上传失败' },
      { status: 500 }
    );
  }
} 