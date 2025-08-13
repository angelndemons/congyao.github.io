import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cong Yao - Biotech Attorney",
  description: "Biotech Attorney Specializing in IP, Agreements, and AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
