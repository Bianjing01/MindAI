import Image from "next/image";
import Carousel from "./components/Carousel";
import TestNav from "./components/TestNav";
import EmotionList from "./components/EmotionList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <h1 className="text-4xl font-bold text-center py-8">
        欢迎来到 MindAI
      </h1>
      <Carousel />
      <TestNav />
      <EmotionList />
    </main>
  );
}
