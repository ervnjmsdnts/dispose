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
    <main className='min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8 flex items-center justify-between'>
          <Link href='/'>
            <Button
              variant='outline'
              className='border-teal-500/30 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 hover:text-teal-400'>
              ← Back to Dashboard
            </Button>
          </Link>

          <Link href='/create-request'>
            <Button className='flex items-center gap-2 bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0'>
              <Plus className='w-4 h-4' />
              New Request
            </Button>
          </Link>
        </div>

        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-white mb-2'>Your Requests</h1>
          <p className='text-lg text-gray-400'>
            Track and manage your disposal requests
          </p>
        </div>

        <div className='space-y-6'>
          {requests && requests.length > 0 ? (
            requests.map((request) => (
              <Card
                key={request._id}
                className='bg-slate-800 border-teal-500/30 overflow-hidden shadow-xl'>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      {request.method === 'pickup' ? (
                        <div className='p-2 bg-orange-500/20 rounded-lg border border-orange-500/30'>
                          <Truck className='w-5 h-5 text-orange-400' />
                        </div>
                      ) : (
                        <div className='p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30'>
                          <MapPin className='w-5 h-5 text-emerald-400' />
                        </div>
                      )}
                      <div>
                        <CardTitle className='text-white text-xl'>
                          {request.method === 'pickup' ? 'Pick-up' : 'Drop-off'}{' '}
                          Request
                        </CardTitle>
                        <CardDescription className='text-gray-400 text-sm mt-1'>
                          Created{' '}
                          {new Date(request._creationTime).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                        request.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : request.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-700 text-gray-400 border-slate-600'
                      }`}>
                      {request.status === 'pending'
                        ? '⏳ '
                        : request.status === 'completed'
                          ? '✅ '
                          : ''}
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-5'>
                    {/* Contact Information */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50'>
                      <div>
                        <p className='text-xs font-semibold text-teal-400 uppercase tracking-wider'>
                          Contact Name
                        </p>
                        <p className='text-white font-medium mt-2'>
                          {request.fullName}
                        </p>
                      </div>
                      <div>
                        <p className='text-xs font-semibold text-teal-400 uppercase tracking-wider'>
                          Contact Info
                        </p>
                        <p className='text-white font-medium mt-2'>
                          {request.contactInfo}
                        </p>
                      </div>
                    </div>

                    {/* Phones */}
                    <div>
                      <p className='text-sm font-semibold text-white mb-3 flex items-center gap-2'>
                        <span className='inline-block w-2 h-2 bg-teal-400 rounded-full'></span>
                        Devices Being Disposed
                      </p>
                      <div className='space-y-2'>
                        {request.phones.map((phoneId) => {
                          const phoneInfo = getPhoneInfo(phoneId);
                          const recyclableCount = Object.values(
                            phoneInfo.partStatuses,
                          ).filter((s) => s === 'Recyclable').length;
                          const hazardousCount = Object.values(
                            phoneInfo.partStatuses,
                          ).filter(
                            (s) => s === 'Disposable (Hazardous)',
                          ).length;
                          return (
                            <div
                              key={phoneId}
                              className='p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:border-teal-500/30 transition-all'>
                              <div className='font-semibold text-white'>
                                {phoneInfo.ownerIdentifier}
                              </div>
                              <div className='text-xs text-gray-400 mt-2 space-y-1'>
                                <div>
                                  ♻️ Recyclable:{' '}
                                  <span className='text-emerald-400 font-medium'>
                                    {recyclableCount}
                                  </span>
                                </div>
                                <div>
                                  ⚠️ Hazardous:{' '}
                                  <span className='text-red-400 font-medium'>
                                    {hazardousCount}
                                  </span>
                                </div>
                                <div>
                                  ✓ Condition Yes:{' '}
                                  <span className='text-cyan-400 font-medium'>
                                    {
                                      Object.values(
                                        phoneInfo.conditionAnswers,
                                      ).filter((v) => v).length
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Location Details */}
                    {request.method === 'pickup' && request.address && (
                      <div className='p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
                        <p className='text-sm font-semibold text-orange-400 mb-2'>
                          📍 Pick-up Address
                        </p>
                        <p className='text-white text-sm'>{request.address}</p>
                      </div>
                    )}

                    {request.method === 'dropoff' && request.dropOffSite && (
                      <div className='p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg'>
                        <p className='text-sm font-semibold text-emerald-400 mb-2'>
                          📍 Drop-off Location
                        </p>
                        <p className='text-white font-medium'>
                          {DROP_OFF_SITES.find(
                            (site) => site.id === request.dropOffSite,
                          )?.name || request.dropOffSite}
                        </p>
                        <p className='text-xs text-gray-400 mt-1'>
                          {
                            DROP_OFF_SITES.find(
                              (site) => site.id === request.dropOffSite,
                            )?.address
                          }
                        </p>
                        <p className='text-xs text-emerald-400 mt-1'>
                          🕒{' '}
                          {
                            DROP_OFF_SITES.find(
                              (site) => site.id === request.dropOffSite,
                            )?.hours
                          }
                        </p>
                      </div>
                    )}

                    {/* Preferred Date */}
                    {request.preferredDate && (
                      <div className='p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg'>
                        <p className='text-sm font-semibold text-cyan-400 mb-2'>
                          📅 Preferred Date
                        </p>
                        <p className='text-white text-sm'>
                          {new Date(request.preferredDate).toLocaleDateString(
                            undefined,
                            {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {request.notes && (
                      <div className='p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg'>
                        <p className='text-sm font-semibold text-gray-300 mb-2'>
                          📝 Special Instructions
                        </p>
                        <p className='text-sm text-gray-400'>{request.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className='bg-slate-800 border-teal-500/30'>
              <CardContent className='text-center py-12'>
                <p className='text-gray-300 text-lg font-medium mb-2'>
                  No disposal requests yet.
                </p>
                <p className='text-gray-400 text-sm mb-6'>
                  Create your first request to schedule a pickup or drop-off.
                </p>
                <Link href='/create-request'>
                  <Button className='bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0'>
                    Create First Request
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
