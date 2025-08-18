'use client';

import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { theme } from '@/lib/theme';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={roboto.className}>
        <SessionProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
