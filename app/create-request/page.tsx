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
import { ArrowLeft, Truck, MapPin } from 'lucide-react';

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
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='mb-6'>
          <Link href='/requests'>
            <Button variant='ghost' className='mb-4'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Requests
            </Button>
          </Link>

          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Create Disposal Request
            </h1>
            <p className='text-lg text-gray-600'>
              Fill out the form below to schedule your phone recycling disposal
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Truck className='w-5 h-5' />
              Disposal Request Form
            </CardTitle>
            <CardDescription>
              Please provide all required information for your disposal request
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            {/* Contact Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='fullName'>Full Name *</Label>
                <Input
                  id='fullName'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder='Enter your full name'
                  required
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='contactInfo'>Contact Phone or Email *</Label>
                <Input
                  id='contactInfo'
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder='Enter phone number or email'
                  required
                  className='mt-1'
                />
              </div>
            </div>

            {/* Phone Selection */}
            <div>
              <Label className='text-base font-medium'>Select Phones *</Label>
              <p className='text-sm text-gray-600 mb-3'>
                Choose the phones you want to dispose of
              </p>
              <div className='space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50'>
                {phones?.map((phone) => (
                  <label
                    key={phone._id}
                    className='flex items-center space-x-3 p-2 rounded hover:bg-white cursor-pointer'>
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
                      className='rounded border-gray-300'
                    />
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium'>
                          {phone.name ||
                            `${phone.brand || 'Unknown'} ${phone.model || 'Phone'}`}
                        </span>
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
                      </div>
                      <div className='text-sm text-gray-600'>
                        {phone.brand && <span>{phone.brand}</span>}
                        {phone.brand && phone.model && <span> • </span>}
                        {phone.model && <span>{phone.model}</span>}
                        {(phone.brand || phone.model) && phone.description && (
                          <span> • </span>
                        )}
                        {phone.description && <span>{phone.description}</span>}
                      </div>
                    </div>
                    <span className='text-sm text-gray-500'>
                      {phone.images.length} photo
                      {phone.images.length !== 1 ? 's' : ''}
                    </span>
                  </label>
                ))}
              </div>
              {selectedPhones.length > 0 && (
                <p className='text-sm text-gray-600 mt-2'>
                  {selectedPhones.length} phone
                  {selectedPhones.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Disposal Method */}
            <div>
              <Label className='text-base font-medium'>Disposal Method *</Label>
              <p className='text-sm text-gray-600 mb-3'>
                Choose how you want to dispose of your phones
              </p>
              <RadioGroup
                value={method}
                onValueChange={(value) =>
                  setMethod(value as 'pickup' | 'dropoff')
                }
                className='space-y-3'>
                <div className='flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50'>
                  <RadioGroupItem value='dropoff' id='dropoff' />
                  <div className='flex-1'>
                    <Label
                      htmlFor='dropoff'
                      className='font-medium cursor-pointer flex items-center gap-2'>
                      <MapPin className='w-4 h-4' />
                      Drop-off at location
                    </Label>
                    <p className='text-sm text-gray-600'>
                      Take your phones to one of our collection sites
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50'>
                  <RadioGroupItem value='pickup' id='pickup' />
                  <div className='flex-1'>
                    <Label
                      htmlFor='pickup'
                      className='font-medium cursor-pointer flex items-center gap-2'>
                      <Truck className='w-4 h-4' />
                      Pick-up from address
                    </Label>
                    <p className='text-sm text-gray-600'>
                      We&apos;ll come to your location to collect your phones
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Conditional Fields based on method */}
            {method === 'pickup' && (
              <div>
                <Label htmlFor='address' className='text-base font-medium'>
                  Pick-up Address *
                </Label>
                <Input
                  id='address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder='Enter your complete address'
                  required
                  className='mt-1'
                />
                <p className='text-sm text-gray-600 mt-1'>
                  Please provide a detailed address including landmarks for easy
                  location
                </p>
              </div>
            )}

            {method === 'dropoff' && (
              <div>
                <Label className='text-base font-medium'>
                  Select Drop-off Site *
                </Label>
                <p className='text-sm text-gray-600 mb-3'>
                  Choose a convenient location to drop off your phones
                </p>
                <RadioGroup
                  value={dropOffSite}
                  onValueChange={setDropOffSite}
                  className='space-y-3'>
                  {DROP_OFF_SITES.map((site) => (
                    <div
                      key={site.id}
                      className='flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50'>
                      <RadioGroupItem
                        value={site.id}
                        id={site.id}
                        className='mt-1'
                      />
                      <div className='flex-1'>
                        <Label
                          htmlFor={site.id}
                          className='font-medium cursor-pointer'>
                          {site.name}
                        </Label>
                        <p className='text-sm text-gray-600 mt-1'>
                          {site.address}
                        </p>
                        <p className='text-sm text-gray-500'>🕒 {site.hours}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Preferred Date */}
            <div>
              <Label htmlFor='preferredDate' className='text-base font-medium'>
                Preferred Date (Optional)
              </Label>
              <Input
                id='preferredDate'
                type='date'
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className='mt-1'
              />
              <p className='text-sm text-gray-600 mt-1'>
                Leave empty if you have no preferred date
              </p>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor='notes' className='text-base font-medium'>
                Notes (Optional)
              </Label>
              <textarea
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Any additional notes or special instructions...'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1'
                rows={4}
              />
              <p className='text-sm text-gray-600 mt-1'>
                Special handling instructions, accessibility needs, or other
                relevant information
              </p>
            </div>

            {/* Submit Button */}
            <div className='pt-4 border-t'>
              <Button
                onClick={handleCreateRequest}
                className='w-full'
                size='lg'
                disabled={isSubmitting}>
                {isSubmitting
                  ? 'Creating Request...'
                  : 'Create Disposal Request'}
              </Button>
              <p className='text-sm text-gray-600 text-center mt-2'>
                You will be redirected to your requests page after submission
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
