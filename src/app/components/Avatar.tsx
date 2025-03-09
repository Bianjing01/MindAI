'use client';

import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: number;
}

export default function Avatar({ src, alt, size = 40 }: AvatarProps) {
  return (
    <div 
      className="relative rounded-full overflow-hidden bg-gray-200"
      style={{ width: size, height: size }}
    >
      <Image
        src={src || '/images/default-avatar.png'}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );
} 