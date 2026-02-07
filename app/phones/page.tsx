'use client';

import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import Image from 'next/image';
import { PARTS_CLASSIFICATIONS, CONDITION_QUESTIONS } from '@/lib/constants';

export default function Phones() {
  const phones = useQuery(api.index.listUserPhones);
  const requests = useQuery(api.index.listUserRequests);
  const [partsModalOpen, setPartsModalOpen] = useState(false);
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [selectedPhoneId, setSelectedPhoneId] = useState<string | null>(null);

  const selectedPhone = phones?.find((p) => p._id === selectedPhoneId);

  // Helper function to get disposal status for a phone
  const getDisposalStatus = (phoneId: string) => {
    if (!requests) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = requests.find((req) => req.phones.includes(phoneId as any));
    return request ? { status: request.status, method: request.method } : null;
  };

  return (
    <main className='min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6'>
          <Link href='/'>
            <Button
              variant='outline'
              className='border-teal-500/30 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 hover:text-teal-400'>
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-white mb-2'>My Devices</h1>
          <p className='text-lg text-gray-400'>
            Manage your registered electronics for responsible recycling
          </p>
        </div>

        {!phones ? (
          <div className='text-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4'></div>
            <p className='text-gray-400'>Loading your devices...</p>
          </div>
        ) : phones.length === 0 ? (
          <Card className='bg-slate-800 border-teal-500/30'>
            <CardContent className='text-center py-12'>
              <p className='text-gray-400 mb-4'>No devices registered yet.</p>
              <Link href='/add-phone'>
                <Button className='bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0'>
                  Add Your First Device
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {phones.map((phone) => (
              <Card
                key={phone._id}
                className='bg-slate-800 border-teal-500/30 overflow-hidden shadow-xl'>
                <CardHeader>
                  <CardTitle className='text-white text-xl'>
                    {phone.ownerIdentifier}
                  </CardTitle>
                  <CardDescription className='grid grid-cols-2 gap-2 items-center mt-3'>
                    <Button
                      onClick={() => {
                        setSelectedPhoneId(phone._id);
                        setPartsModalOpen(true);
                      }}
                      className='text-xs bg-teal-500/20 text-teal-400 border-teal-500/30 hover:bg-teal-500/30 w-full'>
                      Component Status
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedPhoneId(phone._id);
                        setConditionModalOpen(true);
                      }}
                      className='text-xs bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30 w-full'>
                      Condition Details
                    </Button>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {phone.images.length > 0 ? (
                    <div className='space-y-4'>
                      <div className='text-sm text-gray-400'>
                        📸 {phone.images.length} photo
                        {phone.images.length !== 1 ? 's' : ''}
                      </div>
                      <div className='grid grid-cols-2 gap-2'>
                        {phone.images.slice(0, 4).map((imageId, index) => (
                          <div
                            key={imageId}
                            className='relative aspect-square rounded-lg overflow-hidden border border-teal-500/20'>
                            <Image
                              src={phone.imageUrls[index] || ''}
                              alt={`${phone.ownerIdentifier} image ${index + 1}`}
                              fill
                              className='object-cover'
                              sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
                            />
                          </div>
                        ))}
                      </div>
                      {phone.images.length > 4 && (
                        <p className='text-xs text-gray-500 text-center'>
                          +{phone.images.length - 4} more photo
                          {phone.images.length - 4 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className='aspect-square bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center'>
                      <p className='text-gray-500 text-sm'>No photos</p>
                    </div>
                  )}
                  <div className='mt-4 flex gap-2'>
                    <div className='flex-1'>
                      {(() => {
                        const disposalInfo = getDisposalStatus(phone._id);
                        if (disposalInfo) {
                          const { status, method } = disposalInfo;
                          const statusColors = {
                            pending:
                              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                            completed:
                              'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                          };
                          return (
                            <div
                              className={`px-3 py-2 rounded-lg text-sm font-medium text-center border ${statusColors[status as keyof typeof statusColors] || 'bg-slate-700 text-gray-400 border-slate-600'}`}>
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
                            <Link href={`/create-request`}>
                              <Button
                                size='sm'
                                className='w-full bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0'>
                                Schedule Disposal
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

        {/* Parts Status Modal */}
        <Dialog open={partsModalOpen} onOpenChange={setPartsModalOpen}>
          <DialogContent className='bg-slate-900 border-teal-500/20 max-w-2xl max-h-96 overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-white text-xl'>
                Component Classification
              </DialogTitle>
              <DialogDescription className='text-gray-400'>
                Status breakdown for {selectedPhone?.ownerIdentifier}
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-2'>
              {selectedPhone &&
                PARTS_CLASSIFICATIONS.map((part) => (
                  <div
                    key={part}
                    className='flex justify-between items-center p-3 border border-slate-700/50 bg-slate-800/30 rounded-lg'>
                    <span className='font-medium text-white'>{part}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedPhone.partStatuses[part] === 'Recyclable'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : selectedPhone.partStatuses[part] ===
                              'Disposable (Hazardous)'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : selectedPhone.partStatuses[part] ===
                                'Disposable (Contaminated)'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-slate-700/50 text-gray-400 border border-slate-600'
                      }`}>
                      {selectedPhone.partStatuses[part]}
                    </span>
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Condition Answers Modal */}
        <Dialog open={conditionModalOpen} onOpenChange={setConditionModalOpen}>
          <DialogContent className='bg-slate-900 border-teal-500/20 max-w-2xl max-h-96 overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-white text-xl'>
                Device Condition Assessment
              </DialogTitle>
              <DialogDescription className='text-gray-400'>
                Condition answers for {selectedPhone?.ownerIdentifier}
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-2'>
              {selectedPhone &&
                CONDITION_QUESTIONS.map((question, index) => (
                  <div
                    key={index}
                    className='flex justify-between items-center p-3 border border-slate-700/50 bg-slate-800/30 rounded-lg'>
                    <span className='text-sm font-medium flex-1 text-white'>
                      {question}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ml-4 border ${
                        selectedPhone.conditionAnswers[index.toString()]
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                      {selectedPhone.conditionAnswers[index.toString()]
                        ? '✓ Yes'
                        : '✗ No'}
                    </span>
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>

        <div className='mt-12 text-center'>
          <Link href='/add-phone'>
            <Button
              size='lg'
              className='bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 px-8'>
              ➕ Add Another Device
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
