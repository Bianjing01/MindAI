'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TestResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);

  const scores = {
    '沟通互动': 67,
    '教育方式': 67,
    '情感支持': 67,
    '尊重理解': 67,
    '陪伴关注': 67,
  };

  const suggestions = [
    '多与孩子进行有效沟通，倾听他们的想法和感受',
    '在教育方式上保持耐心和适度，避免过分严厉',
    '增加与孩子的互动时间，参与他们的学习和娱乐',
    '尊重孩子的个性发展，给予适当的自主空间',
    '关注孩子的情绪变化，及时给予情感支持',
  ];

  const handleSaveAndPrint = async () => {
    try {
      setSaving(true);
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        router.push('/auth/login');
        return;
      }

      const userInfo = JSON.parse(savedUser);
      
      // 保存测评结果
      const response = await fetch('/api/test-results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.id,
          category: 'parent-child', // 这里可以根据实际测评类型修改
          scores,
          suggestions,
        }),
      });

      if (response.ok) {
        // 打印报告
        window.print();
        // 保存成功后跳转到个人资料页面
        router.push('/profile');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存测评结果失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">维度评分</h1>
        
        {/* 维度评分展示 */}
        {Object.entries(scores).map(([dimension, score]) => (
          <div key={dimension} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-gray-700">{dimension}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {dimension === '沟通互动' && '评估与孩子的沟通质量和频率'}
                  {dimension === '教育方式' && '评估教育孩子的方法和态度'}
                  {dimension === '情感支持' && '评估对孩子的情感关怀程度'}
                  {dimension === '尊重理解' && '评估对孩子的尊重和理解程度'}
                  {dimension === '陪伴关注' && '评估对孩子的陪伴和关注程度'}
                </span>
              </div>
              <span className="text-blue-600">{score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        ))}

        {/* 个性化建议 */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">个性化建议</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">基于您的测评结果，我们建议：</p>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/test-analysis')}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            重新测试
          </button>
          <button
            onClick={handleSaveAndPrint}
            disabled={saving}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {saving ? '保存中...' : '打印报告'}
          </button>
        </div>
      </div>
    </div>
  );
} 