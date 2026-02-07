'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, MapPin } from 'lucide-react';

// Static drop-off sites data
const DROP_OFF_SITES = [
  {
    id: 'sm-city-batangas-sm-cares',
    name: 'SM City Batangas – SM Cares E-Waste Collection',
    address:
      '2nd Floor Cyberzone, SM City Batangas, Pallocan West, Batangas City',
    hours: 'Mon–Sun 10:00–21:00',
  },
  {
    id: 'globe-ewaste-sm-city-batangas',
    name: 'Globe E-Waste Zero Bin – SM City Batangas',
    address: 'Ground Floor, SM City Batangas, Pallocan West, Batangas City',
    hours: 'Mon–Sun 10:00–21:00',
  },
  {
    id: 'batangas-city-enro',
    name: 'Batangas City ENRO – Environmental Office',
    address: 'Batangas City Hall Compound, Poblacion, Batangas City',
    hours: 'Mon–Fri 8:00–17:00',
  },
];

export default function CreateRequest() {
  const phones = useQuery(api.index.listUserPhones);
  const createRequest = useMutation(api.index.createDisposalRequest);
  const router = useRouter();

  const [selectedPhones, setSelectedPhones] = useState<Id<'phones'>[]>([]);
  const [method, setMethod] = useState<'pickup' | 'dropoff'>('dropoff');
  const [address, setAddress] = useState('');
  const [dropOffSite, setDropOffSite] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRequest = async () => {
    if (selectedPhones.length === 0) {
      alert('Please select at least one phone');
      return;
    }

    if (!fullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!contactInfo.trim()) {
      alert('Please enter your contact information');
      return;
    }

    if (method === 'pickup' && !address.trim()) {
      alert('Please enter a pick-up address');
      return;
    }

    if (method === 'dropoff' && !dropOffSite) {
      alert('Please select a drop-off site');
      return;
    }

    setIsSubmitting(true);

    try {
      await createRequest({
        phones: selectedPhones,
        method,
        fullName: fullName.trim(),
        contactInfo: contactInfo.trim(),
        address: method === 'pickup' ? address.trim() : undefined,
        dropOffSite: method === 'dropoff' ? dropOffSite : undefined,
        preferredDate: preferredDate || undefined,
        notes: notes.trim() || undefined,
      });

      // Redirect back to requests page
      router.push('/requests');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='mb-8'>
          <Link href='/requests'>
            <Button
              variant='outline'
              className='border-teal-500/30 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 hover:text-teal-400 mb-6'>
              ← Back to Requests
            </Button>
          </Link>

          <div className='space-y-3'>
            <h1 className='text-3xl sm:text-4xl font-bold text-white'>
              Schedule Pickup or Drop-off
            </h1>
            <p className='text-gray-400 text-lg'>
              Select your phones and arrange for secure, responsible disposal
            </p>
          </div>
        </div>

        <Card className='bg-slate-800 border-teal-500/30 shadow-2xl'>
          <CardHeader>
            <CardTitle className='text-2xl text-white flex items-center gap-2'>
              <Truck className='w-6 h-6 text-teal-400' />
              Disposal Request
            </CardTitle>
            <CardDescription className='text-gray-400'>
              Provide your details and select your disposal preference
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-8'>
            {/* Contact Information */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
                <span className='w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold'>
                  1
                </span>
                Your Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='fullName'
                    className='text-white font-semibold'>
                    Full Name *
                  </Label>
                  <Input
                    id='fullName'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder='John Doe'
                    required
                    className='bg-slate-800/50 border-teal-500/30 text-white placeholder:text-gray-500 focus:border-teal-500'
                  />
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='contactInfo'
                    className='text-white font-semibold'>
                    Contact Phone or Email *
                  </Label>
                  <Input
                    id='contactInfo'
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder='+63 9xx xxx xxxx'
                    required
                    className='bg-slate-800/50 border-teal-500/30 text-white placeholder:text-gray-500 focus:border-teal-500'
                  />
                </div>
              </div>
            </div>

            {/* Phone Selection */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
                <span className='w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold'>
                  2
                </span>
                Select Devices *
              </h3>
              <p className='text-sm text-gray-400'>
                Choose which registered devices you want to dispose of
              </p>
              <div className='space-y-2 max-h-64 overflow-y-auto border border-slate-700/50 rounded-lg p-4 bg-slate-800/30 scrollbar-thin scrollbar-thumb-teal-500/20 scrollbar-track-slate-800/50'>
                {phones && phones.length > 0 ? (
                  phones.map((phone) => (
                    <label
                      key={phone._id}
                      className='flex items-start gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-teal-500/30 cursor-pointer transition-all'>
                      <input
                        type='checkbox'
                        checked={selectedPhones.includes(phone._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPhones([...selectedPhones, phone._id]);
                          } else {
                            setSelectedPhones(
                              selectedPhones.filter((id) => id !== phone._id),
                            );
                          }
                        }}
                        className='w-4 h-4 mt-2 border-teal-500/30 rounded bg-slate-700/50 cursor-pointer accent-teal-500'
                      />
                      <div className='flex-1'>
                        <p className='font-semibold text-white'>
                          {phone.ownerIdentifier}
                        </p>
                        <p className='text-xs text-gray-400 mt-1'>
                          ♻️{' '}
                          {
                            Object.values(phone.partStatuses).filter(
                              (s) => s === 'Recyclable',
                            ).length
                          }{' '}
                          Recyclable • ⚠️{' '}
                          {
                            Object.values(phone.partStatuses).filter(
                              (s) => s === 'Disposable (Hazardous)',
                            ).length
                          }{' '}
                          Hazardous • {phone.images.length} photo
                          {phone.images.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className='text-gray-400 text-center py-4'>
                    No devices registered yet.{' '}
                    <Link
                      href='/add-phone'
                      className='text-teal-400 hover:underline'>
                      Add a device first.
                    </Link>
                  </p>
                )}
              </div>
              {selectedPhones.length > 0 && (
                <p className='text-sm text-teal-400 font-medium'>
                  ✓ {selectedPhones.length} device
                  {selectedPhones.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Disposal Method */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
                <span className='w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold'>
                  3
                </span>
                Choose Disposal Method *
              </h3>
              <RadioGroup
                value={method}
                onValueChange={(value) =>
                  setMethod(value as 'pickup' | 'dropoff')
                }
                className='space-y-3'>
                <div className='flex items-center gap-3 p-4 border border-slate-700/50 rounded-lg bg-slate-800/30 hover:border-emerald-500/30 cursor-pointer transition-all'>
                  <RadioGroupItem
                    value='dropoff'
                    id='dropoff'
                    className='self-center w-4 h-4 accent-emerald-500'
                  />
                  <div className='flex-1'>
                    <Label
                      htmlFor='dropoff'
                      className='font-semibold text-white cursor-pointer flex items-center gap-2'>
                      <MapPin className='w-4 h-4 text-emerald-400' />
                      Drop-off at Certified Center
                    </Label>
                    <p className='text-sm text-gray-400 mt-1'>
                      Take your devices to one of our partner e-waste centers
                      for proper handling
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-4 border border-slate-700/50 rounded-lg bg-slate-800/30 hover:border-orange-500/30 cursor-pointer transition-all'>
                  <RadioGroupItem
                    value='pickup'
                    id='pickup'
                    className='self-center w-4 h-4 accent-orange-500'
                  />
                  <div className='flex-1'>
                    <Label
                      htmlFor='pickup'
                      className='font-semibold text-white cursor-pointer flex items-center gap-2'>
                      <Truck className='w-4 h-4 text-orange-400' />
                      Schedule Pick-up
                    </Label>
                    <p className='text-sm text-gray-400 mt-1'>
                      We&apos;ll collect your devices from your home address at
                      a time convenient for you
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Conditional Fields based on method */}
            {method === 'pickup' && (
              <div className='space-y-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
                <Label htmlFor='address' className='text-white font-semibold'>
                  Pick-up Address *
                </Label>
                <textarea
                  id='address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder='House No., Street, District, City, Postal Code'
                  required
                  className='w-full px-3 py-2 bg-slate-800/50 border border-orange-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder:text-gray-500'
                  rows={3}
                />
                <p className='text-sm text-gray-400'>
                  Include complete address with landmarks for easy location
                </p>
              </div>
            )}

            {method === 'dropoff' && (
              <div className='space-y-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg'>
                <Label className='text-white font-semibold'>
                  Select Drop-off Center *
                </Label>
                <p className='text-sm text-gray-400 mb-3'>
                  All centers accept and properly handle e-waste
                </p>
                <RadioGroup
                  value={dropOffSite}
                  onValueChange={setDropOffSite}
                  className='space-y-3'>
                  {DROP_OFF_SITES.map((site) => (
                    <div
                      key={site.id}
                      className='flex items-center gap-3 p-4 border border-slate-700/50 rounded-lg bg-slate-800/30 hover:border-emerald-500/30 cursor-pointer transition-all'>
                      <RadioGroupItem
                        value={site.id}
                        id={site.id}
                        className='self-center w-4 h-4 accent-emerald-500'
                      />
                      <div className='flex-1'>
                        <Label
                          htmlFor={site.id}
                          className='font-semibold text-white cursor-pointer'>
                          {site.name}
                        </Label>
                        <p className='text-sm text-gray-400 mt-2'>
                          📍 {site.address}
                        </p>
                        <p className='text-sm text-emerald-400 mt-1'>
                          🕒 {site.hours}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Preferred Date */}
            <div className='space-y-2'>
              <Label
                htmlFor='preferredDate'
                className='text-white font-semibold'>
                Preferred Date (Optional)
              </Label>
              <Input
                id='preferredDate'
                type='date'
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className='bg-slate-800/50 border-teal-500/30 text-white focus:border-teal-500'
              />
              <p className='text-sm text-gray-400'>
                Leave empty if you have no preference
              </p>
            </div>

            {/* Notes */}
            <div className='space-y-2'>
              <Label htmlFor='notes' className='text-white font-semibold'>
                Special Instructions (Optional)
              </Label>
              <textarea
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Any special handling needs, accessibility requirements, or additional instructions...'
                className='w-full px-3 py-2 bg-slate-800/50 border border-teal-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 placeholder:text-gray-500'
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className='pt-6 border-t border-slate-700/50 space-y-4'>
              <Button
                onClick={handleCreateRequest}
                className='w-full bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 font-semibold py-6 text-lg'
                size='lg'
                disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className='inline-block animate-spin mr-2'>⏳</span>
                    Creating Request...
                  </>
                ) : (
                  '✓ Create Disposal Request'
                )}
              </Button>
              <p className='text-xs text-gray-500 text-center'>
                Your request will be reviewed and you&apos;ll receive updates on
                your registered contact
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
