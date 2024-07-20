"use client";
import styles from "./index.module.css";
import { Menu } from "antd";
import {
  MailOutlined,
  DragOutlined,
  RadiusSettingOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { flatten } from "../../lib/util.js";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const pathname = usePathname();

  const items = [
    {
      key: "drag",
      label: "拖拽组件",
      icon: <DragOutlined />,
      children: [{ key: "react-dnd", label: "react-dnd", route: "/drag/dnd" }],
    },
    {
      key: "x6",
      label: "X6",
      icon: <RadiusSettingOutlined />,
      children: [{ key: "mind", label: "思维导图", route: "/x6/mind" }],
    },
    {
      key: "three",
      label: "three.js",
      icon: <MailOutlined />,
      children: [{ key: "map", label: "地图", route: "/three/map" }],
    },
  ];
  const flatItems = flatten(items);

  useEffect(() => {
    const obj = flatItems.find((item) => item.route === pathname);
    if(obj){
      setSelectedKeys([obj.key]);
    }
  }, []);

  const handleSelect = (e) => {
    const { key } = e;
    console.log("ey", key);
    const obj = flatItems.find((item) => item.key === key);
    router.push(obj.route);
    setSelectedKeys([key]);
  };

  return (
    <div className={styles.sidebar}>
      <Menu
        className={styles.main}
        defaultOpenKeys={items.map((obj) => obj.key)}
        mode="inline"
        theme="dark"
        items={items}
        onSelect={handleSelect}
        selectedKeys={selectedKeys}
      />
    </div>
  );
}
