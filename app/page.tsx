'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
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
import {
  Smartphone,
  Zap,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Droplet,
} from 'lucide-react';

export default function Home() {
  return (
    <div className='min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950'>
      <SignedOut>
        <HeroSection />
      </SignedOut>

      <SignedIn>
        <Dashboard />
      </SignedIn>
    </div>
  );
}

function HeroSection() {
  return (
    <div className='relative overflow-hidden'>
      {/* Gradient background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 blur-3xl rounded-full'></div>
        <div className='absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full'></div>
      </div>

      <div className='relative'>
        {/* Hero Section */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32'>
          <div className='text-center space-y-8 max-w-3xl mx-auto'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight'>
              Manage E-Waste Responsibly,{' '}
              <span className='bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent'>
                With Ease
              </span>
            </h1>

            <p className='text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed'>
              Document your electronic devices, classify their components, and
              schedule secure disposal or recycling. Protect the environment
              while recovering valuable materials.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-8'>
              <SignInButton mode='modal'>
                <Button
                  size='lg'
                  className='bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 gap-2'>
                  <Smartphone className='w-5 h-5' />
                  Register Your Device
                </Button>
              </SignInButton>
              <Link href='/center'>
                <Button
                  variant='outline'
                  size='lg'
                  className='border-teal-500/30 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 hover:text-teal-400 gap-2'>
                  <MapPin className='w-5 h-5' />
                  Find Centers
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
          <h2 className='text-2xl sm:text-3xl font-bold text-white text-center mb-12'>
            Why Responsible E-Waste Management Matters
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
            <div className='bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-teal-500/20 rounded-lg p-8 hover:border-teal-500/50 transition-all'>
              <div className='bg-teal-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4'>
                <Zap className='w-6 h-6 text-teal-400' />
              </div>
              <h3 className='text-lg font-semibold text-white mb-3'>
                Protect the Environment
              </h3>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Electronic waste contains toxic materials like lead, mercury,
                and cadmium. Proper disposal prevents soil and water
                contamination. Over 50 million tons of e-waste are generated
                annually—help us divert this from landfills.
              </p>
            </div>

            <div className='bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-cyan-500/20 rounded-lg p-8 hover:border-cyan-500/50 transition-all'>
              <div className='bg-cyan-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4'>
                <Droplet className='w-6 h-6 text-cyan-400' />
              </div>
              <h3 className='text-lg font-semibold text-white mb-3'>
                Recover Valuable Materials
              </h3>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Phones contain precious metals like gold, silver, and copper.
                Recycling recovers up to 95% of materials, reducing the need for
                mining and saving energy. Every phone recycled saves 240kg of
                CO₂ equivalent.
              </p>
            </div>

            <div className='bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-emerald-500/20 rounded-lg p-8 hover:border-emerald-500/50 transition-all'>
              <div className='bg-emerald-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4'>
                <CheckCircle className='w-6 h-6 text-emerald-400' />
              </div>
              <h3 className='text-lg font-semibold text-white mb-3'>
                Secure & Convenient
              </h3>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Schedule pickups from your home or choose certified drop-off
                centers near you. All devices are properly documented and
                securely disposed according to environmental regulations.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
          <h2 className='text-2xl sm:text-3xl font-bold text-white text-center mb-12'>
            How It Works
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            {[
              {
                step: '1',
                title: 'Register Device',
                desc: 'Document your phone with photos and component details',
              },
              {
                step: '2',
                title: 'Classify Parts',
                desc: 'Mark each component as recyclable or disposable',
              },
              {
                step: '3',
                title: 'Schedule Pickup',
                desc: 'Choose pickup or find a nearby certified drop-off',
              },
              {
                step: '4',
                title: 'Track Status',
                desc: 'Monitor your request and disposal progress',
              },
            ].map((item, idx) => (
              <div key={idx} className='relative'>
                <div className='bg-slate-800/50 backdrop-blur border border-teal-500/20 rounded-lg p-6 text-center h-full'>
                  <div className='w-10 h-10 rounded-full bg-linear-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold mx-auto mb-4'>
                    {item.step}
                  </div>
                  <h3 className='font-semibold text-white mb-2'>
                    {item.title}
                  </h3>
                  <p className='text-sm text-gray-400'>{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className='hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-linear-to-r from-teal-500 to-transparent'></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* E-Waste Facts */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
          <div className='bg-linear-to-r from-slate-800/50 to-slate-900/50 backdrop-blur border border-teal-500/20 rounded-lg p-8 sm:p-12'>
            <h2 className='text-2xl sm:text-3xl font-bold text-white mb-8'>
              Why This Matters: E-Waste Facts
            </h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div className='flex gap-4'>
                <AlertTriangle className='w-6 h-6 text-red-400 shrink-0 mt-1' />
                <div>
                  <p className='font-semibold text-white mb-1'>
                    57 Million Tons Annually
                  </p>
                  <p className='text-sm text-gray-400'>
                    E-waste generated globally each year, with only 20% formally
                    recycled.
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <Zap className='w-6 h-6 text-yellow-400 shrink-0 mt-1' />
                <div>
                  <p className='font-semibold text-white mb-1'>
                    3x Economic Value
                  </p>
                  <p className='text-sm text-gray-400'>
                    Recycled materials from phones are worth 3x more than mining
                    new ore.
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <Droplet className='w-6 h-6 text-blue-400 shrink-0 mt-1' />
                <div>
                  <p className='font-semibold text-white mb-1'>
                    Toxic Contamination
                  </p>
                  <p className='text-sm text-gray-400'>
                    Improper disposal poisons soil and groundwater for decades.
                  </p>
                </div>
              </div>

              <div className='flex gap-4'>
                <CheckCircle className='w-6 h-6 text-green-400 shrink-0 mt-1' />
                <div>
                  <p className='font-semibold text-white mb-1'>
                    Infinite Recycling
                  </p>
                  <p className='text-sm text-gray-400'>
                    Materials like copper and gold can be recycled infinitely
                    without quality loss.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
          <div className='bg-linear-to-r from-teal-600/20 to-cyan-600/20 backdrop-blur border border-teal-500/50 rounded-lg p-8 sm:p-12 text-center'>
            <h2 className='text-2xl sm:text-3xl font-bold text-white mb-6'>
              Ready to Make a Difference?
            </h2>
            <p className='text-gray-300 text-lg mb-8 max-w-2xl mx-auto'>
              Join thousands of users in responsibly managing electronic waste.
              Start by registering your first device today.
            </p>
            <SignInButton mode='modal'>
              <Button
                size='lg'
                className='bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0'>
                Get Started Now
              </Button>
            </SignInButton>
          </div>
        </section>
      </div>
    </div>
  );
}

function Dashboard() {
  const phones = useQuery(api.index.listUserPhones);
  const requests = useQuery(api.index.listUserRequests);

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='space-y-8'>
        {/* Welcome */}
        <div>
          <h2 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
            Welcome Back
          </h2>
          <p className='text-gray-400'>
            Continue managing your electronic devices responsibly
          </p>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Link href='/add-phone'>
            <Card className='bg-slate-800 border-teal-500/30 hover:border-teal-500/50 transition-all cursor-pointer h-full'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-teal-400'>
                  <Smartphone className='w-5 h-5' />
                  Add Device
                </CardTitle>
                <CardDescription className='text-gray-400'>
                  Register a new phone
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href='/phones'>
            <Card className='bg-slate-800 border-cyan-500/30 hover:border-cyan-500/50 transition-all cursor-pointer h-full'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-cyan-400'>
                  <CheckCircle className='w-5 h-5' />
                  My Devices
                </CardTitle>
                <CardDescription className='text-gray-400'>
                  {phones?.length || 0} registered
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href='/create-request'>
            <Card className='bg-slate-800 border-emerald-500/30 hover:border-emerald-500/50 transition-all cursor-pointer h-full'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-emerald-400'>
                  <MapPin className='w-5 h-5' />
                  Schedule Pickup
                </CardTitle>
                <CardDescription className='text-gray-400'>
                  Arrange collection
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href='/center'>
            <Card className='bg-slate-800 border-teal-500/30 hover:border-teal-500/50 transition-all cursor-pointer h-full'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-emerald-400'>
                  <MapPin className='w-5 h-5' />
                  Centers
                </CardTitle>
                <CardDescription className='text-gray-400'>
                  Find disposal centers
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href='/requests'>
            <Card className='bg-slate-800 border-orange-500/30 hover:border-orange-500/50 transition-all cursor-pointer h-full'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-orange-400'>
                  <Zap className='w-5 h-5' />
                  Requests
                </CardTitle>
                <CardDescription className='text-gray-400'>
                  {requests?.length || 0} active
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Devices */}
        {phones && phones.length > 0 && (
          <Card className='bg-slate-800 border-teal-500/30'>
            <CardHeader>
              <CardTitle className='text-white'>Recent Devices</CardTitle>
              <CardDescription className='text-gray-400'>
                You have {phones.length} device{phones.length !== 1 ? 's' : ''}{' '}
                registered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {phones.slice(0, 3).map((phone) => (
                  <div
                    key={phone._id}
                    className='bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:border-teal-500/30 transition-all'>
                    <h3 className='font-semibold text-white mb-2'>
                      {phone.ownerIdentifier}
                    </h3>
                    <div className='flex gap-2 flex-wrap mb-3'>
                      {(() => {
                        const recyclable = Object.values(
                          phone.partStatuses,
                        ).filter((s) => s === 'Recyclable').length;
                        const hazardous = Object.values(
                          phone.partStatuses,
                        ).filter((s) => s === 'Disposable (Hazardous)').length;
                        return (
                          <>
                            {recyclable > 0 && (
                              <span className='text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded'>
                                ♻️ {recyclable} Recyclable
                              </span>
                            )}
                            {hazardous > 0 && (
                              <span className='text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded'>
                                ⚠️ {hazardous} Hazardous
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <p className='text-xs text-gray-500'>
                      {phone.images.length} image
                      {phone.images.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
              {phones.length > 3 && (
                <Link href='/phones' className='mt-4 block'>
                  <Button
                    variant='outline'
                    className='w-full border-teal-500/30 text-teal-400 hover:bg-teal-500/10'>
                    View All Devices
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
