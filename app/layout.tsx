import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ClerkProvider } from '@clerk/nextjs';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Recycle } from 'lucide-react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dispose - Responsible E-Waste Management',
  description:
    'Manage and recycle your electronic devices responsibly. Document phones, schedule pickups, and find certified drop-off centers.',
};

function Header() {
  return (
    <header className='sticky top-0 z-50 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-teal-500/20 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          <Link href='/' className='flex items-center gap-2 group'>
            <div className='p-2 bg-linear-to-br from-teal-400 to-cyan-500 rounded-lg group-hover:shadow-lg group-hover:shadow-teal-500/50 transition-all'>
              <Recycle className='w-5 h-5 text-slate-900' />
            </div>
            <span className='text-xl font-bold bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent'>
              Dispose
            </span>
          </Link>

          <nav className='hidden md:flex items-center gap-8'>
            <SignedIn>
              <Link
                href='/add-phone'
                className='text-gray-300 hover:text-teal-400 transition-colors text-sm font-medium'>
                Register Device
              </Link>
              <Link
                href='/phones'
                className='text-gray-300 hover:text-teal-400 transition-colors text-sm font-medium'>
                My Devices
              </Link>
              <Link
                href='/requests'
                className='text-gray-300 hover:text-teal-400 transition-colors text-sm font-medium'>
                Requests
              </Link>
              <Link
                href='/center'
                className='text-gray-300 hover:text-teal-400 transition-colors text-sm font-medium'>
                Centers
              </Link>
            </SignedIn>
          </nav>

          <div className='flex items-center gap-4'>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode='modal'>
                <Button
                  variant='outline'
                  size='sm'
                  className='border-teal-500/30 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 hover:text-teal-400'>
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-b from-slate-950 via-slate-900 to-slate-950`}>
        <ClerkProvider>
          <Providers>
            <Header />
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
