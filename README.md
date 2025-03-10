## 环境准备

开发环境有node.js(16.8或者更高)，还有npm，通过命令来检查

```
node -v
npm -v
```

国内npm镜像很慢，用下面淘宝定制的（gzip压缩支持）的cnpm

```
npm install -g cnpm --registry=https://registry.npmmirror.com
npm config set registry https://registry.npmmirror.com
```

这样可以用cnpm

```
cnpm install [name]
```

查阅地址：http://npm.taobao.org/。

## 创建项目

笔者使用官方脚手架工具create-next-app，基于webpack+ES6

```
npx create-next-app@latest my-next-app
```

遇到如下信息：

```
Would you like to use TypeScript? No / Yes
Would you like to use ESLint? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to use Turbopack for `next dev`?  No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
```

从上到下的翻译是：

```
您想使用 TypeScript 吗？否 / 是
您想使用 ESLint 吗？否 / 是
您想使用 Tailwind CSS 吗？否 / 是
您想将代码放在 `src/` 目录中吗？否 / 是
您想使用 App Router 吗？（推荐）否 / 是
您想将 Turbopack 用于 `next dev` 吗？否 / 是
您想自定义导入别名（默认为 `@/*`）吗？否 / 是
您想配置什么导入别名？@/*
```

笔者全都要用，所以全都是yes,如果你的操作步骤和我相同 ，那么会有下面的文件

```
📦my-next-app
 ┣ 📂node_modules
 ┣ 📂public
 ┃ ┣ 📜file.svg
 ┃ ┣ 📜globe.svg
 ┃ ┣ 📜next.svg
 ┃ ┣ 📜vercel.svg
 ┃ ┗ 📜window.svg
 ┣ 📂src
 ┃ ┗ 📂app
 ┃ ┃ ┣ 📜favicon.ico
 ┃ ┃ ┣ 📜globals.css
 ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┣ 📜.gitignore
 ┣ 📜eslint.config.mjs
 ┣ 📜next-env.d.ts
 ┣ 📜next.config.ts
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜postcss.config.mjs
 ┣ 📜README.md
 ┗ 📜tsconfig.json
```

项目会有同时兼容错误，安装依赖就好

```
npm install @types/react @types/react-dom @types/node --save-dev
```

解释一些文件

```
app/ 目录用于存放页面和布局文件，是 Next.js 中的核心目录。
public/ 用于存放公开的静态资源文件。
styles/ 用于存放样式文件。
node_modules/ 存放项目的所有依赖包。
package.json 是项目的配置文件，包含项目依赖和脚本命令。
next.config.js 用于定制 Next.js 的配置
```

## 启动开发服务器

根目录下执行命令

```
npm run dev
```

默认情况下，Next.js 会启动在 `http://localhost:3000`。打开浏览器访问该地址，你会看到默认的欢迎页面。

## 修改首页和布局文件

app/page.tsx

```typescript
export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">欢迎emo-heart</h1>
      <p className="mt-4 text-gray-600">关注心理健康</p>
    </div>
  );
}
```

app/layout.tsx

```typescript
import './globals.css';

export const metadata = {
  title: '心理健康助手',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}

```

## 集成MySQL数据库

### 安装Prisma

Prisma 是一个现代化的 ORM 工具，支持 MySQL、PostgreSQL 等数据库。运行以下命令安装 Prisma：

```bash
npm install prisma @prisma/client
```

初始化prisam

```bash
npx prisma init
```

这会在项目中生成一个 `prisma` 目录，其中包含 `schema.prisma` 文件。

### 配置mysql连接

打开 `prisma/schema.prisma` 文件，修改 `datasource` 部分以连接 MySQL 数据库：

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

```

在 `.env` 文件中添加数据库连接信息：

```env
DATABASE_URL="mysql://用户名:密码@localhost:3306/数据库名"
```

在 `schema.prisma` 中定义你的数据模型。例如：

```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

运行以下命令生成 Prisma 客户端并同步数据库：

```bash
npx prisma migrate dev --name init


npx prisma db push
npx prisma generate
npx prisma studio（检查状态）
```

## 集成 Zustand 状态管理

### 安装 Zustand

Zustand 是一个轻量级的状态管理库。运行以下命令安装：

```bash
npm install zustand
```

### 创建 Store

在项目中创建一个 `store` 目录，并添加一个 `useStore.ts` 文件：

```ts
import { create } from 'zustand';

interface StoreState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;
```

### 在组件中使用 Store

在 `app/page.tsx` 中使用 Zustand Store：

```tsx
"use client"; // 标记为 Client Component
import useStore from '../store/useStore';

export default function Home() {
  const { count, increment, decrement } = useStore();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">欢迎来到无代码平台</h1>
      <p className="mt-4 text-gray-600">从这里开始，构建你的梦想应用！</p>
      <div className="mt-4">
        <p>Count: {count}</p>
        <button onClick={increment} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
          Increment
        </button>
        <button onClick={decrement} className="px-4 py-2 bg-red-500 text-white rounded">
          Decrement
        </button>
      </div>
    </div>
  );
}
```

### 注意事项

如果你在运行项目时遇到以下错误：

```vbscript
Unhandled Runtime Error

[ Server ] Error: useSyncExternalStore only works in Client Components. Add the "use client" directive at the top of the file to use it. Read more: https://nextjs.org/docs/messages/react-client-hook-in-server-component
```

**原因：**
 Next.js 13 的 App Router 默认将所有组件视为 **Server Component**。Server Component 在服务器端渲染，无法使用 React 的客户端特性（如 `useState`、`useEffect`、`useSyncExternalStore` 等）。Zustand 的 `useStore` 依赖于 `useSyncExternalStore`，因此必须在 **Client Component** 中使用。

**解决方法：**
 在需要使用 Zustand 的组件文件顶部添加 `"use client"` 指令，明确告诉 Next.js 这是一个 **Client Component**。

------

提交代码

最后，将代码提交到 Git 仓库：

```bash
bash 代码解读复制代码git init
git add .
git commit -m "初始化 Next.js 项目"
```

## 用cursor、墨刀、deepseek搭建页面

打开cursor，网上很多教程，这里不赘述，下载好打开就行

ctrl+I：我们打开问答框，找agent，自主编码工具

![image-20250307170211009](C:\Users\bian\AppData\Roaming\Typora\typora-user-images\image-20250307170211009.png)

把导航图片喂给它，让他写出来，然后要求他把登陆注册全都写完，然后就可以顺利注册和登录了，完成所有都不需要两分钟

![image-20250307170517445](C:\Users\bian\AppData\Roaming\Typora\typora-user-images\image-20250307170517445.png)









npx prisma studio，可以查看数据库状态

### 导航

#### TestNav

#### Navbar

#### FloatingMenu

### 首页

#### 轮播图

#### AI测试

#### AI情绪

#### 社区

#### 我的

### AI测试

#### 亲子

#### 能力

#### 健康

#### 婚姻

#### 个人

#### 社交

### AI检测情绪

### AI咨询

### 心理社区



