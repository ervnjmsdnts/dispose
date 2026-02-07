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
import { Truck, MapPin, Plus } from 'lucide-react';

// Static drop-off sites data
const DROP_OFF_SITES = [
  {
    id: 'sm-city-batangas-sm-cares',
    name: 'SM City Batangas - SM Cares E-Waste Collection',
    address:
      '2nd Floor Cyberzone, SM City Batangas, Pallocan West, Batangas City',
    hours: 'Mon-Sun 10:00-21:00',
  },
  {
    id: 'globe-ewaste-sm-city-batangas',
    name: 'Globe E-Waste Zero Bin - SM City Batangas',
    address: 'Ground Floor, SM City Batangas, Pallocan West, Batangas City',
    hours: 'Mon-Sun 10:00-21:00',
  },
  {
    id: 'batangas-city-enro',
    name: 'Batangas City ENRO - Environmental Office',
    address: 'Batangas City Hall Compound, Poblacion, Batangas City',
    hours: 'Mon-Fri 8:00-17:00',
  },
];

export default function Requests() {
  const requests = useQuery(api.index.listUserRequests);
  const phones = useQuery(api.index.listUserPhones);

  const getPhoneInfo = (phoneId: string) => {
    const phone = phones?.find((p) => p._id === phoneId);
    if (!phone)
      return {
        ownerIdentifier: 'Unknown Phone',
        partStatuses: {},
        conditionAnswers: {},
      };

    return {
      ownerIdentifier: phone.ownerIdentifier,
      partStatuses: phone.partStatuses || {},
      conditionAnswers: phone.conditionAnswers || {},
    };
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6 flex justify-between items-center'>
          <Link href='/'>
            <Button variant='ghost'>← Back</Button>
          </Link>

          <Link href='/create-request'>
            <Button className='flex items-center gap-2'>
              <Plus className='w-4 h-4' />
              Create New Request
            </Button>
          </Link>
        </div>

        <div className='space-y-6'>
          {requests && requests.length > 0 ? (
            requests.map((request) => (
              <Card key={request._id}>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    {request.method === 'pickup' ? (
                      <Truck className='w-5 h-5' />
                    ) : (
                      <MapPin className='w-5 h-5' />
                    )}
                    {request.method === 'pickup' ? 'Pick-up' : 'Drop-off'}{' '}
                    Request
                  </CardTitle>
                  <CardDescription>
                    Status:{' '}
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}{' '}
                    • Created:{' '}
                    {new Date(request._creationTime).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {/* Contact Information */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm font-medium text-gray-700'>
                          Contact Name
                        </p>
                        <p className='text-sm'>{request.fullName}</p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-700'>
                          Contact Info
                        </p>
                        <p className='text-sm'>{request.contactInfo}</p>
                      </div>
                    </div>

                    {/* Phones */}
                    <div>
                      <p className='text-sm font-medium text-gray-700 mb-2'>
                        Phones
                      </p>
                      <div className='space-y-2'>
                        {request.phones.map((phoneId) => {
                          const phoneInfo = getPhoneInfo(phoneId);
                          return (
                            <div
                              key={phoneId}
                              className='p-3 border border-gray-200 rounded-lg'>
                              <div className='font-medium text-sm'>
                                {phoneInfo.ownerIdentifier}
                              </div>
                              <div className='text-xs text-gray-600 mt-1'>
                                Recyclable:{' '}
                                {
                                  Object.values(phoneInfo.partStatuses).filter(
                                    (s) => s === 'Recyclable',
                                  ).length
                                }{' '}
                                • Hazardous:{' '}
                                {
                                  Object.values(phoneInfo.partStatuses).filter(
                                    (s) => s === 'Disposable (Hazardous)',
                                  ).length
                                }{' '}
                                • Yes Answers:{' '}
                                {
                                  Object.values(
                                    phoneInfo.conditionAnswers,
                                  ).filter((v) => v).length
                                }
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Location Details */}
                    {request.method === 'pickup' && request.address && (
                      <div>
                        <p className='text-sm font-medium text-gray-700'>
                          Pick-up Address
                        </p>
                        <p className='text-sm'>{request.address}</p>
                      </div>
                    )}

                    {request.method === 'dropoff' && request.dropOffSite && (
                      <div>
                        <p className='text-sm font-medium text-gray-700'>
                          Drop-off Location
                        </p>
                        <p className='text-sm'>
                          {DROP_OFF_SITES.find(
                            (site) => site.id === request.dropOffSite,
                          )?.name || request.dropOffSite}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {
                            DROP_OFF_SITES.find(
                              (site) => site.id === request.dropOffSite,
                            )?.address
                          }
                        </p>
                      </div>
                    )}

                    {/* Preferred Date */}
                    {request.preferredDate && (
                      <div>
                        <p className='text-sm font-medium text-gray-700'>
                          Preferred Date
                        </p>
                        <p className='text-sm'>
                          {new Date(request.preferredDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {request.notes && (
                      <div>
                        <p className='text-sm font-medium text-gray-700'>
                          Notes
                        </p>
                        <p className='text-sm'>{request.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className='text-center py-8'>
                <p className='text-gray-600'>No disposal requests yet.</p>
                <p className='text-sm text-gray-500 mt-2'>
                  Create your first request to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
