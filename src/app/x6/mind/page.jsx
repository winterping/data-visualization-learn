"use client";
import dynamic from "next/dynamic";
import { Spin } from "antd";

// 动态引入组件
const MindComponent = dynamic(() => import("./MindMap"), {
  loading: () => (
    <Spin size="large" style={{ position: 'absolute', left: "50%", top: "50%" }}></Spin>
  ), // 加载状态显示
  ssr: false, // 如果不需要服务器端渲染该组件
});

export default function Page() {
  return <MindComponent />;
}
