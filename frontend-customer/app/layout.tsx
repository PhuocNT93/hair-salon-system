'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';

import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    // Load messages on the client side
    import('@/messages/en.json')
      .then((module) => setMessages(module.default))
      .catch((error) => console.error('Failed to load messages:', error));
  }, []);

  if (!messages) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeRegistry>
            <div>Loading...</div>
          </ThemeRegistry>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale="en">
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
