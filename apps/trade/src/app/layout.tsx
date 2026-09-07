import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "NETNAPZ TRADE",
  description: "Market intelligence and GMX-powered execution.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
