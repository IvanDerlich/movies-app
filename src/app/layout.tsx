import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Browser",
  description: "Browse and search movies using OMDB API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
