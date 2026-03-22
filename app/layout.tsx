import "./globals.css";

export const metadata = {
  title: "顯化美麗人生",
  description: "透過科學方法實踐顯化，記錄習慣、覺察情緒、感恩日記",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className="bg-background min-h-screen">{children}</body>
    </html>
  );
}
