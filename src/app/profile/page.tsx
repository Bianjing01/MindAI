'use client';

import { useRouter } from 'next/navigation';
import ProfileClient from '../components/ProfileClient';

interface MoodRecord {
  date: string;
  mood: string;
  note: string;
  color: string;
}

export default function Profile() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileClient />      
    </div>
  );
} 