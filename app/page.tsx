'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <h1 className='text-2xl font-bold text-gray-900'>Dispose</h1>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode='modal'>
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <SignedOut>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Recycle Your Phones Easily
            </h2>
            <p className='text-lg text-gray-600 mb-8'>
              Take pictures of your old phones and arrange for pickup or
              drop-off.
            </p>
            <SignInButton mode='modal'>
              <Button size='lg'>Get Started</Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <Dashboard />
        </SignedIn>
      </main>
    </div>
  );
}

function Dashboard() {
  const phones = useQuery(api.index.listUserPhones);
  const requests = useQuery(api.index.listUserRequests);

  return (
    <div className='space-y-8'>
      <div className='text-center'>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          Welcome to Dispose
        </h2>
        <p className='text-lg text-gray-600'>
          Manage your phone recycling process
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Add Phones</CardTitle>
            <CardDescription>
              Document your phones for recycling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href='/add-phone'>
              <Button className='w-full'>Add Phone</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Phones</CardTitle>
            <CardDescription>Preview your documented phones</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href='/phones'>
              <Button variant='outline' className='w-full'>
                View Phones ({phones?.length || 0})
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Request</CardTitle>
            <CardDescription>Schedule phone disposal</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href='/create-request'>
              <Button variant='outline' className='w-full'>
                Create Request
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Requests</CardTitle>
            <CardDescription>Check your disposal requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href='/requests'>
              <Button variant='outline' className='w-full'>
                View Requests ({requests?.length || 0})
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {phones && phones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Phones</CardTitle>
            <CardDescription>
              Phones you&apos;ve documented ({phones.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {phones.map((phone) => (
                <div key={phone._id} className='border rounded-lg p-4'>
                  <h3 className='font-medium'>{phone.ownerIdentifier}</h3>
                  <p className='text-sm text-gray-600'>
                    Recyclable:{' '}
                    {
                      Object.values(phone.partStatuses).filter(
                        (s) => s === 'Recyclable',
                      ).length
                    }
                  </p>
                  <p className='text-sm text-gray-500'>
                    {phone.images.length} image
                    {phone.images.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
