import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "СТРОФА — учи стихи легко",
  description: "Интерактивный тренажёр для запоминания стихов и любых текстов.",
};

export const viewport: Viewport = {
  themeColor: "#6d5ce8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
