import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import styles from "./layout.module.css";
import Sidebar from "../components/sidebar/index";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full">
      <body className="w-full h-full" suppressHydrationWarning={true}>
        <AntdRegistry>
          <div className={styles.container}>
            <Sidebar />
            <div className={styles.main}>{children}</div>
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}
