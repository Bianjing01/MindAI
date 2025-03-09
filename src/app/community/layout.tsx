import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '心理社区 - MindAI',
  description: '分享你的故事，倾听他人的声音',
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 