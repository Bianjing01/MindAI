import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/app/emotion-analysis/data.json');

async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回初始数据
    return {
      analysisHistory: [],
      totalCount: 0,
      emotionDistribution: {},
      dailyTrends: []
    };
  }
}

async function writeData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const { mainEmotion, emotionBreakdown } = await request.json();
    const data = await readData();

    // 更新总次数
    data.totalCount += 1;

    // 更新情绪分布
    Object.entries(emotionBreakdown).forEach(([emotion, value]) => {
      if (!data.emotionDistribution[emotion]) {
        data.emotionDistribution[emotion] = 0;
      }
      data.emotionDistribution[emotion] += 1;
    });

    // 更新每日趋势
    const today = new Date().toLocaleDateString('zh-CN');
    const todayScore = Math.round(Math.random() * 20 + 80); // 模拟情绪分数
    
    const existingTrendIndex = data.dailyTrends.findIndex(
      (trend: any) => trend.date === today
    );

    if (existingTrendIndex !== -1) {
      data.dailyTrends[existingTrendIndex].score = todayScore;
    } else {
      data.dailyTrends.push({ date: today, score: todayScore });
      // 只保留最近7天的数据
      if (data.dailyTrends.length > 7) {
        data.dailyTrends.shift();
      }
    }

    // 保存历史记录
    data.analysisHistory.push({
      date: new Date().toISOString(),
      mainEmotion,
      emotionBreakdown
    });

    // 只保留最近100条记录
    if (data.analysisHistory.length > 100) {
      data.analysisHistory.shift();
    }

    await writeData(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('更新统计数据错误:', error);
    return NextResponse.json(
      { error: '更新统计数据失败' },
      { status: 500 }
    );
  }
} 