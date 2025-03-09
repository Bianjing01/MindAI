'use client';

import { useEffect, useState } from "react";
import Carousel from "./Carousel";
import TestNav from "./TestNav";
import EmotionList from "./EmotionList";
import FloatingMenu from "./FloatingMenu";

export default function HomeClient() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 从 localStorage 读取用户信息
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userInfo = JSON.parse(savedUser);
        setUser(userInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold text-center py-8">
        欢迎来到 MindAI{user ? `, ${user.name}` : ''}
      </h1>
      <Carousel />
      <TestNav />
      <EmotionList />
      <FloatingMenu />
    </>
  );
} 