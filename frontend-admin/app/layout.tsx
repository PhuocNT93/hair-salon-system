'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';

import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <body className="font-sans antialiased">
          <ThemeRegistry>
            <div>Loading...</div>
          </ThemeRegistry>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale="en">
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
