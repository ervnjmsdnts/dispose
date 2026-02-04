'use client';

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default function Phones() {
  const phones = useQuery(api.index.listUserPhones);
  const requests = useQuery(api.index.listUserRequests);

  // Helper function to get disposal status for a phone
  const getDisposalStatus = (phoneId: string) => {
    if (!requests) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = requests.find((req) => req.phones.includes(phoneId as any));
    return request ? { status: request.status, method: request.method } : null;
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6'>
          <Link href='/'>
            <Button variant='ghost'>← Back to Dashboard</Button>
          </Link>
        </div>

        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Phones</h1>
          <p className='text-lg text-gray-600'>
            Preview all your documented phones for recycling
          </p>
        </div>

        {!phones ? (
          <div className='text-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading your phones...</p>
          </div>
        ) : phones.length === 0 ? (
          <Card>
            <CardContent className='text-center py-12'>
              <p className='text-gray-600 mb-4'>No phones documented yet.</p>
              <Link href='/add-phone'>
                <Button>Add Your First Phone</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {phones.map((phone) => (
              <Card key={phone._id} className='overflow-hidden'>
                <CardHeader>
                  <CardTitle className='text-lg'>
                    {phone.name ||
                      `${phone.brand || 'Unknown'} ${phone.model || 'Phone'}`}
                  </CardTitle>
                  <CardDescription className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          phone.condition === 'excellent'
                            ? 'bg-green-100 text-green-800'
                            : phone.condition === 'good'
                              ? 'bg-blue-100 text-blue-800'
                              : phone.condition === 'fair'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                        {phone.condition.charAt(0).toUpperCase() +
                          phone.condition.slice(1)}
                      </span>
                      {phone.brand && (
                        <span className='text-sm text-gray-600'>
                          {phone.brand}
                        </span>
                      )}
                      {phone.model && (
                        <span className='text-sm text-gray-600'>
                          • {phone.model}
                        </span>
                      )}
                    </div>
                    {phone.description && (
                      <p className='text-sm text-gray-600 mt-2'>
                        {phone.description}
                      </p>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {phone.images.length > 0 ? (
                    <div className='space-y-4'>
                      <div className='text-sm text-gray-600'>
                        {phone.images.length} image
                        {phone.images.length !== 1 ? 's' : ''}
                      </div>
                      <div className='grid grid-cols-2 gap-2'>
                        {phone.images.slice(0, 4).map((imageId, index) => (
                          <div key={imageId} className='relative aspect-square'>
                            <Image
                              src={phone.imageUrls[index] || ''}
                              alt={`${phone.name || 'Phone'} image ${index + 1}`}
                              fill
                              className='object-cover rounded-lg'
                              sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
                            />
                          </div>
                        ))}
                      </div>
                      {phone.images.length > 4 && (
                        <p className='text-sm text-gray-500 text-center'>
                          +{phone.images.length - 4} more image
                          {phone.images.length - 4 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className='aspect-square bg-gray-100 rounded-lg flex items-center justify-center'>
                      <p className='text-gray-500 text-sm'>No images</p>
                    </div>
                  )}
                  <div className='mt-4 flex gap-2'>
                    <div className='flex-1'>
                      {(() => {
                        const disposalInfo = getDisposalStatus(phone._id);
                        if (disposalInfo) {
                          const { status, method } = disposalInfo;
                          const statusColors = {
                            pending: 'bg-yellow-100 text-yellow-800',
                            completed: 'bg-green-100 text-green-800',
                          };
                          return (
                            <div
                              className={`px-3 py-2 rounded-md text-sm font-medium text-center ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                              {status === 'pending'
                                ? '⏳ '
                                : status === 'completed'
                                  ? '✅ '
                                  : ''}
                              {status.charAt(0).toUpperCase() + status.slice(1)}{' '}
                              ({method === 'pickup' ? 'Pick-up' : 'Drop-off'})
                            </div>
                          );
                        } else {
                          return (
                            <Link href={`/requests`}>
                              <Button size='sm' className='w-full'>
                                Request Disposal
                              </Button>
                            </Link>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className='mt-8 text-center'>
          <Link href='/add-phone'>
            <Button size='lg'>Add Another Phone</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
