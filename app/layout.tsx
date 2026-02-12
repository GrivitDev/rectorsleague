import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "The Rector's League",
  description: "Match Management System"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

