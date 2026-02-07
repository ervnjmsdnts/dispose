'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Clock,
  CheckCircle,
  Building2,
  Smartphone,
  Laptop,
  Monitor,
  Battery,
  Navigation,
  Award,
} from 'lucide-react';

interface DisposalCenter {
  id: string;
  name: string;
  address: string;
  hours: string;
  hoursDetail?: { day: string; hours: string }[];
  distance?: string;
  acceptedItems: string[];
  coordinates?: { lat: number; lng: number };
}

const DROP_OFF_SITES: DisposalCenter[] = [
  {
    id: 'sm-city-batangas-sm-cares',
    name: 'SM City Batangas - SM Cares E-Waste Collection',
    address:
      '2nd Floor Cyberzone, SM City Batangas, Pallocan West, Batangas City',
    hours: 'Mon–Sun 10:00–21:00',
    hoursDetail: [{ day: 'Monday - Sunday', hours: '10:00 AM - 9:00 PM' }],
    acceptedItems: ['Smartphones', 'Tablets', 'Laptops', 'Batteries', 'Cables'],
    coordinates: { lat: 13.7565, lng: 121.0583 },
  },
  {
    id: 'globe-ewaste-sm-city-batangas',
    name: 'Globe E-Waste Zero Bin - SM City Batangas',
    address: 'Ground Floor, SM City Batangas, Pallocan West, Batangas City',
    hours: 'Mon–Sun 10:00–21:00',
    hoursDetail: [{ day: 'Monday - Sunday', hours: '10:00 AM - 9:00 PM' }],
    acceptedItems: ['Mobile Phones', 'Chargers', 'Small Electronics'],
    coordinates: { lat: 13.7565, lng: 121.0583 },
  },
  {
    id: 'batangas-city-enro',
    name: 'Batangas City ENRO - Environmental Office',
    address: 'Batangas City Hall Compound, Poblacion, Batangas City',
    hours: 'Mon–Fri 8:00–17:00',
    hoursDetail: [
      { day: 'Monday - Friday', hours: '8:00 AM - 5:00 PM' },
      { day: 'Saturday - Sunday', hours: 'Closed' },
    ],
    acceptedItems: ['All Electronics', 'Batteries', 'Hazardous E-Waste'],
    coordinates: { lat: 13.7567, lng: 121.0584 },
  },
];

export default function Center() {
  const [loadingDirection, setLoadingDirection] = useState<string | null>(null);

  function getDirections(site: DisposalCenter) {
    if (!navigator.geolocation) {
      // Fallback: just search for the destination
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
      window.open(url, '_blank');
      return;
    }

    setLoadingDirection(site.id);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Use directions with origin (user location) and destination (center address)
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(site.address)}`;
        window.open(url, '_blank');
        setLoadingDirection(null);
      },
      () => {
        // Fallback: just search for the destination without user location
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
        window.open(url, '_blank');
        setLoadingDirection(null);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <main className='min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold text-white mb-3'>
            Certified Disposal Centers
          </h1>
          <p className='text-gray-400 text-lg mb-6'>
            Find authorized e-waste collection points near you. All centers are
            certified and environmentally compliant.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-4'>
            {DROP_OFF_SITES.map((site) => (
              <Card
                key={site.id}
                className='bg-slate-800 border-slate-700/50 hover:border-teal-500/50 transition-all'>
                <CardHeader>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <CardTitle className='text-white text-lg'>
                          {site.name}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Address */}
                  <div className='flex gap-3'>
                    <MapPin className='w-5 h-5 text-teal-400 shrink-0 mt-0.5' />
                    <p className='text-gray-300 text-sm'>{site.address}</p>
                  </div>

                  {/* Hours */}
                  <div className='flex gap-3'>
                    <Clock className='w-5 h-5 text-emerald-400 shrink-0' />
                    <div className='text-sm'>
                      <p className='text-gray-300 font-medium'>{site.hours}</p>
                      {site.hoursDetail && (
                        <div className='mt-1 space-y-0.5'>
                          {site.hoursDetail.map((detail, idx) => (
                            <p key={idx} className='text-gray-500 text-xs'>
                              {detail.day}: {detail.hours}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accepted Items */}
                  <div>
                    <p className='text-xs text-gray-500 mb-2'>
                      Accepted Items:
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {site.acceptedItems.map((item, idx) => (
                        <span
                          key={idx}
                          className='text-xs bg-slate-700/50 text-gray-300 px-2 py-1 rounded'>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-3 pt-2'>
                    <Button
                      onClick={() => getDirections(site)}
                      disabled={loadingDirection === site.id}
                      className='flex-1 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50'>
                      <Navigation
                        className={`w-4 h-4 mr-2 ${
                          loadingDirection === site.id ? 'animate-spin' : ''
                        }`}
                      />
                      {loadingDirection === site.id
                        ? 'Getting Location...'
                        : 'Get Directions'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <aside className='space-y-6'>
            {/* Preparation Checklist */}
            <Card className='bg-slate-800 border-emerald-500/30'>
              <CardHeader>
                <CardTitle className='text-white flex items-center gap-2'>
                  <CheckCircle className='w-5 h-5 text-emerald-400' />
                  Preparation Checklist
                </CardTitle>
                <CardDescription className='text-gray-400'>
                  Before dropping off your device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3'>
                  {[
                    {
                      icon: Smartphone,
                      text: 'Backup and factory reset devices',
                    },
                    {
                      icon: Battery,
                      text: 'Remove SIM, SD cards, and batteries if safe',
                    },
                    {
                      icon: CheckCircle,
                      text: 'Remove cases and accessories',
                    },
                  ].map((item, idx) => (
                    <li key={idx} className='flex gap-3'>
                      <item.icon className='w-4 h-4 text-emerald-400 shrink-0 mt-0.5' />
                      <span className='text-gray-300 text-sm'>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* What We Accept */}
            <Card className='bg-slate-800 border-cyan-500/30'>
              <CardHeader>
                <CardTitle className='text-white flex items-center gap-2'>
                  <Building2 className='w-5 h-5 text-cyan-400' />
                  Accepted Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-3'>
                  {[
                    { icon: Smartphone, label: 'Phones' },
                    { icon: Laptop, label: 'Laptops' },
                    { icon: Monitor, label: 'Monitors' },
                    { icon: Battery, label: 'Batteries' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className='flex flex-col items-center gap-2 p-3 bg-slate-700/30 rounded-lg'>
                      <item.icon className='w-6 h-6 text-cyan-400' />
                      <span className='text-xs text-gray-300'>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <p className='text-xs text-gray-500 mt-3'>
                  and many more electronic devices
                </p>
              </CardContent>
            </Card>

            {/* Why Proper Disposal */}
            <Card className='bg-slate-800 border-orange-500/30'>
              <CardHeader>
                <CardTitle className='text-white flex items-center gap-2'>
                  <Award className='w-5 h-5 text-orange-400' />
                  Why It Matters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2 text-sm text-gray-400'>
                  <li className='flex gap-2'>
                    <span className='text-orange-400'>•</span>
                    Prevent toxic contamination
                  </li>
                  <li className='flex gap-2'>
                    <span className='text-orange-400'>•</span>
                    Recover valuable materials
                  </li>
                  <li className='flex gap-2'>
                    <span className='text-orange-400'>•</span>
                    Reduce carbon footprint
                  </li>
                  <li className='flex gap-2'>
                    <span className='text-orange-400'>•</span>
                    Protect data security
                  </li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
