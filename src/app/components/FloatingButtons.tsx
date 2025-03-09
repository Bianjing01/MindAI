'use client';

import Link from 'next/link';

export default function FloatingButtons() {
  return (
    <div className="fixed right-4 bottom-4 flex flex-col gap-3 z-50">
      <Link href="/profile" className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-2xl">👤</span>
          <span className="text-xs text-gray-600">我的</span>
        </div>
      </Link>
      
      <Link href="/ai-chat" className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-2xl">💭</span>
          <span className="text-xs text-gray-600">AI咨询</span>
        </div>
      </Link>
      
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg hover:bg-green-200 transition-colors shadow-lg"
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl">⬆️</span>
          <span className="text-xs text-gray-600">顶部</span>
        </div>
      </button>
    </div>
  );
} 