'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import AuthModal from './components/AuthModal'

export default function LandingPage() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    mode: 'login'
  });

  useEffect(() => {
    // 检查 URL 参数
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('login')) {
      setAuthModal({ isOpen: true, mode: 'login' });
    } else if (urlParams.has('register')) {
      setAuthModal({ isOpen: true, mode: 'register' });
    }
  }, []);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
    // 清除 URL 参数
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleModeChange = (mode: 'login' | 'register') => {
    setAuthModal({ ...authModal, mode });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5F5]">
      {/* Hero Section */}
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-300 via-pink-300 to-orange-200">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              你好！我是
            </h1>
            <div className="text-5xl md:text-7xl font-bold text-white">
              Mind AI
            </div>
          </div>
          <p className="text-xl md:text-2xl text-white/90">
            您身边的心理医生
          </p>
          <div className="space-x-4">
            <button
              onClick={() => openAuthModal('login')}
              className="inline-block px-8 py-3 text-lg font-medium text-white border-2 border-white rounded-full hover:bg-white hover:text-pink-500 transition-colors duration-300"
            >
              登录
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="inline-block px-8 py-3 text-lg font-medium bg-white text-pink-500 border-2 border-white rounded-full hover:bg-transparent hover:text-white transition-colors duration-300"
            >
              注册
            </button>
          </div>
        </div>
      </div>

      {/* Who Am I Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h2 className="text-6xl font-normal text-pink-500" style={{ fontFamily: 'var(--font-emblema-one)' }}>
              Who Am I?
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              <p>亲爱的朋友，欢迎来到我们的 AI 心理健康服务平台！</p>
              <p>在这里，我们运用先进 AI 技术，为您提供贴心关怀。</p>
              <p>通过情绪分析，帮您精准洞察内心感受；AI 测评助您全面了解心理状态；AI 咨询随时倾听，给出专业建议。还有社区服务，让您与大家相互支持。</p>
              <p>快来开启专属您的心理健康之旅，我们陪您一路同行。</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/images/landing-image.jpg"
                alt="Woman using laptop"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* What I Do Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-8xl font-normal text-pink-400 mb-32" style={{ fontFamily: 'var(--font-emblema-one)' }}>
            What I Do
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            {/* AI Services */}
            <div>
              <h3 className="text-4xl font-bold text-pink-400 mb-12">AI服务</h3>
              <ul className="space-y-8">
                <li className="flex items-center space-x-6">
                  <span className="text-2xl text-gray-700">AI测评</span>
                </li>
                <li className="flex items-center space-x-6">
                  <span className="text-2xl text-gray-700">AI情绪分析</span>
                </li>
                <li className="flex items-center space-x-6">
                  <span className="text-2xl text-gray-700">AI咨询</span>
                </li>
                <li className="flex items-center space-x-6">
                  <span className="text-2xl text-gray-700">AI语音聊天</span>
                </li>
              </ul>
            </div>

            {/* Community Section */}
            <div>
              <h3 className="text-4xl font-bold text-pink-400 mb-12">心理社区</h3>
              <ul className="space-y-8">
                <li className="flex items-center space-x-6">
                  <span className="text-2xl text-gray-700">收藏感兴趣的帖子</span>
                </li>
                <li className="flex items-center space-x-6">
                  <span className="text-2xl text-gray-700">提问</span>
                </li>
                <li className="flex items-center space-x-6">
                  <span className="text-2xl text-gray-700">评论</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Consulting Services Section */}
      <div className="min-h-screen bg-gradient-to-b from-blue-300 via-purple-300 to-pink-300 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-8xl font-normal text-white mb-32 text-center" style={{ fontFamily: 'var(--font-emblema-one)' }}>
              Consulting Services
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {/* AI测评 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-8">
                  <Image
                    src="/images/ai-test-icon.svg"
                    alt="AI测评"
                    width={96}
                    height={96}
                    className="text-white"
                  />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">AI测评</h3>
                <p className="text-xl text-white">
                  来这里挑选你感兴趣的<br />
                  量表测试
                </p>
              </div>

              {/* AI情绪分析 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-8">
                  <Image
                    src="/images/ai-emotion-icon.svg"
                    alt="AI情绪分析"
                    width={96}
                    height={96}
                    className="text-white"
                  />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">AI情绪分析</h3>
                <p className="text-xl text-white">
                  最近情绪怎么呢？<br />
                  要是觉得的话，来这里<br />
                  找点乐趣
                </p>
              </div>

              {/* AI咨询 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-8">
                  <Image
                    src="/images/ai-consult-icon.svg"
                    alt="AI咨询"
                    width={96}
                    height={96}
                    className="text-white"
                  />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">AI咨询</h3>
                <p className="text-xl text-white">
                  想和我对话吗？<br />
                  或者<br />
                  你想得到什么知识呢？
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Reviews Section */}
      <div className="min-h-screen bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-8xl font-normal text-black mb-32" style={{ fontFamily: 'var(--font-emblema-one)' }}>
              Community Reviews
            </h2>
            
            <div className="space-y-8">
              {/* Review Card 1 */}
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src="/images/review-1.jpg"
                    alt="开心果"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">开心果</h3>
                  <p className="text-xl text-gray-700">
                    今天真的很开心，Anna老师的声音真的好听，在她的安慰下，我舒服多啦！
                  </p>
                </div>
              </div>

              {/* Review Card 2 */}
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src="/images/review-2.jpg"
                    alt="宝宝妮儿"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">宝宝妮儿</h3>
                  <p className="text-xl text-gray-700">
                    想和社区的小伙伴们讨论一下，考前焦虑怎么办？
                  </p>
                </div>
              </div>

              {/* Review Card 3 */}
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src="/images/review-3.jpg"
                    alt="大壮"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">大壮</h3>
                  <p className="text-xl text-gray-700">
                    朋友们，我今天捡了100块钱呢！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What They Say Section */}
      <div className="min-h-screen bg-[#FFF5F5] py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              {/* Left Column - Title */}
              <div>
                <h2 className="text-8xl font-normal text-pink-400 sticky top-24" style={{ fontFamily: 'var(--font-emblema-one)' }}>
                  What<br />
                  They<br />
                  Say
                </h2>
              </div>

              {/* Right Column - Content */}
              <div className="space-y-24">
                {/* Review 1 */}
                <div>
                  <h3 className="text-3xl font-bold text-pink-400 mb-4">深夜心灵的温暖港湾</h3>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    在深夜辗转难眠、心里烦恼无人诉说的时刻，这个 AI 心理健康服务平台简直就是"及时雨"。AI 对话随时在线倾听陪伴，就像有个知心好友时刻在侧。用强大的 AI 力量驱散阴霾，带来阳光，真的太贴心了！
                  </p>
                </div>

                {/* Review 2 */}
                <div>
                  <h3 className="text-3xl font-bold text-pink-400 mb-4">超厉害的 AI 平台</h3>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    生活偶尔布满乌云，心情随之低落，AI 情绪分析精准捕捉情绪波动，给予我温暖的回应，心理社区给我带来希望之光。它用爱陪我走出阴霾，迎接生活的灿烂晴空，这样的平台简直太棒了！
                  </p>
                </div>

                {/* Review 3 */}
                <div>
                  <h3 className="text-3xl font-bold text-pink-400 mb-4">超贴心的家</h3>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    当孤独感袭来，不知道该向谁求助的时候，这个 AI 心理健康服务平台一直都在，太让人安心了！借助 AI 测评可以更好地了解自己，和 AI 对话能畅所欲言，在心理社区还能结识志同道合的朋友。真的是孤独者的福音！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grow with me Section */}
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-pink-200">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-4 mb-32">
              <h2 className="text-8xl font-normal text-white" style={{ fontFamily: 'var(--font-emblema-one)' }}>
                Grow with me.
              </h2>
              <p className="text-3xl text-white/90">期待和你的共同成长</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
              {/* Phone */}
              <div>
                <h3 className="text-2xl font-bold text-pink-400 uppercase mb-4">Phone</h3>
                <p className="text-xl text-white">(123) 456-7890</p>
              </div>

              {/* Email */}
              <div>
                <h3 className="text-2xl font-bold text-pink-400 uppercase mb-4">Email</h3>
                <p className="text-xl text-white">hello@reallygreatsite.com</p>
              </div>

              {/* Social Media */}
              <div className="flex gap-4 md:justify-end">
                <Link href="https://facebook.com" target="_blank" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <Image
                    src="/images/facebook-icon.svg"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="https://twitter.com" target="_blank" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <Image
                    src="/images/twitter-icon.svg"
                    alt="Twitter"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="https://instagram.com" target="_blank" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-pink-100 transition-colors">
                  <Image
                    src="/images/instagram-icon.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
        onModeChange={handleModeChange}
      />
    </div>
  )
}
