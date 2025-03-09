import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const CommunityClient = dynamic(() => import('./CommunityClient'), {
  ssr: false
});

export const metadata: Metadata = {
  title: '心理社区 - MindAI',
  description: '分享你的故事，倾听他人的声音',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityClient />
    </div>
  );
} 