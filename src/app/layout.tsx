import type { Metadata } from "next";
import "./globals.css";
import { MovieProvider } from "@/contexts/MovieContext";

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
      <body>
        <MovieProvider>
          {children}
        </MovieProvider>
      </body>
    </html>
  );
}
