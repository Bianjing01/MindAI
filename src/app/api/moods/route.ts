import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 获取用户的心情记录
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用户ID' },
        { status: 400 }
      );
    }

    const moods = await prisma.moodRecord.findMany({
      where: {
        userId: parseInt(userId),
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json(moods);
  } catch (error) {
    console.error('获取心情记录失败:', error);
    return NextResponse.json(
      { error: '获取心情记录失败' },
      { status: 500 }
    );
  }
}

// 保存心情记录
export async function POST(request: Request) {
  try {
    const { userId, date, mood, note } = await request.json();

    // 检查是否已存在该日期的记录
    const existingMood = await prisma.moodRecord.findFirst({
      where: {
        userId: parseInt(userId),
        date: date
      }
    });

    let moodRecord;
    if (existingMood) {
      // 更新已存在的记录
      moodRecord = await prisma.moodRecord.update({
        where: {
          id: existingMood.id
        },
        data: {
          mood,
          note
        }
      });
    } else {
      // 创建新记录
      moodRecord = await prisma.moodRecord.create({
        data: {
          userId: parseInt(userId),
          date,
          mood,
          note
        }
      });
    }

    return NextResponse.json(moodRecord);
  } catch (error) {
    console.error('保存心情记录失败:', error);
    return NextResponse.json(
      { error: '保存心情记录失败' },
      { status: 500 }
    );
  }
} 