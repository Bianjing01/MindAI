'use client';

import Image from 'next/image';

const AuthBackground = () => {
  return (
    <div className="hidden lg:block lg:w-1/2 relative">
      <div className="absolute inset-0 bg-[#E3F2FD]">
        {/* 装饰性圆形元素 */}
        <div className="absolute right-10 top-20 w-20 h-20 rounded-full bg-[#90CAF9]/30"></div>
        <div className="absolute right-20 top-40 w-32 h-32 rounded-full bg-[#64B5F6]/20"></div>
        <div className="absolute right-40 top-60 w-24 h-24 rounded-full bg-[#42A5F5]/20"></div>
        <div className="absolute right-60 top-80 w-16 h-16 rounded-full bg-[#2196F3]/10"></div>
        
        {/* 波浪形状装饰 */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-[#BBDEFB]/20"></div>
      </div>
    </div>
  );
};

export default AuthBackground; 