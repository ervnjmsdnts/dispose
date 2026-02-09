'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PARTS_CLASSIFICATIONS, CONDITION_QUESTIONS } from '@/lib/constants';

// Calculate part statuses based on condition answers
const calculatePartStatuses = (
  answers: Record<string, boolean>,
): Record<string, string> => {
  // Map answers to readable names
  const power = answers['0'] === true; // Does phone power on?
  const battery = answers['1'] === true; // Battery damaged?
  const screen = answers['2'] === true; // Screen cracked?
  const water = answers['3'] === true; // Water exposure?
  const corrosion = answers['4'] === true; // Corrosion?
  const fire = answers['5'] === true; // Fire damage?
  const speaker = answers['6'] === true; // Speaker faulty?
  const vibration = answers['7'] === true; // Vibrates?
  const ports = answers['8'] === true; // Ports damaged?
  const casing = answers['9'] === true; // Casing damaged?

  const statuses: Record<string, string> = {};

  // Battery
  statuses['Battery'] =
    battery || fire ? 'Disposable (Hazardous)' : 'Recyclable';

  // Screen
  statuses['Screen'] = screen ? 'Disposable (Broken)' : 'Recyclable';

  // Motherboard
  if (water || corrosion) {
    statuses['Motherboard'] = 'Disposable (Contaminated)';
  } else if (!power) {
    statuses['Motherboard'] = 'Recyclable (requires testing)';
  } else {
    statuses['Motherboard'] = 'Recyclable';
  }

  // Camera
  statuses['Camera'] =
    water || corrosion ? 'Disposable (Contaminated)' : 'Recyclable';

  // Speaker
  statuses['Speaker'] = speaker ? 'Disposable (Faulty)' : 'Recyclable';

  // Microphone
  statuses['Microphone'] =
    water || corrosion ? 'Disposable (Contaminated)' : 'Recyclable';

  // Casing
  statuses['Casing'] = casing ? 'Disposable (Damaged)' : 'Recyclable';

  // Connectors & Ports
  statuses['Connectors & Ports'] = ports
    ? 'Disposable (Damaged)'
    : 'Recyclable';

  // SIM/SD Tray
  statuses['SIM/SD Tray'] =
    water || corrosion ? 'Disposable (Contaminated)' : 'Recyclable';

  // Flex Cable
  statuses['Flex Cable'] =
    water || corrosion ? 'Disposable (Contaminated)' : 'Recyclable';

  // Vibration Motor
  statuses['Vibration Motor'] = !vibration
    ? 'Disposable (Non-functional)'
    : 'Recyclable';

  return statuses;
};

export default function AddPhone() {
  const [ownerIdentifier, setOwnerIdentifier] = useState('');
  const [conditionAnswers, setConditionAnswers] = useState<
    Record<string, boolean | undefined>
  >(() => {
    const initial: Record<string, boolean | undefined> = {};
    CONDITION_QUESTIONS.forEach((_, index) => {
      initial[index.toString()] = undefined;
    });
    return initial;
  });
  const [partStatuses, setPartStatuses] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [imageStorageIds, setImageStorageIds] = useState<Id<'_storage'>[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPhone = useMutation(api.index.createPhone);
  const uploadImage = useAction(api.index.uploadImage);
  const createPhoneWithImages = useMutation(api.index.createPhoneWithImages);
  const router = useRouter();

  // Auto-calculate part statuses when condition answers change
  useEffect(() => {
    const allAnswered = CONDITION_QUESTIONS.every(
      (_, index) => conditionAnswers[index.toString()] !== undefined,
    );
    if (allAnswered) {
      const calculated = calculatePartStatuses(
        conditionAnswers as Record<string, boolean>,
      );
      setPartStatuses(calculated);
    }
  }, [conditionAnswers]);

  useEffect(() => {
    // Check if camera is available
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput',
        );
        setHasCamera(videoDevices.length > 0);
        console.log('Available video devices:', videoDevices.length);
      })
      .catch((error) => {
        console.error('Error checking camera availability:', error);
        setHasCamera(false);
      });
  }, []);

  const startCamera = async () => {
    setCameraLoading(true);
    try {
      console.log('Requesting camera access...');
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera, but allow fallback
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted', stream);
      console.log('Video ref current:', videoRef.current);

      // Wait for video element to be rendered (since it's conditionally rendered)
      let attempts = 0;
      while (!videoRef.current && attempts < 20) {
        console.log('Waiting for video element to render...', attempts + 1);
        await new Promise((resolve) => setTimeout(resolve, 50));
        attempts++;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play(); // Ensure video starts playing
        console.log('Video playing');
        setIsCapturing(true);
      } else {
        console.error('Video element never rendered');
        alert('Camera interface failed to load. Please refresh and try again.');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Try fallback without facingMode
      try {
        console.log('Trying fallback camera access...');
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Wait for video element to be rendered
        let fallbackAttempts = 0;
        while (!videoRef.current && fallbackAttempts < 20) {
          console.log(
            'Waiting for video element (fallback)...',
            fallbackAttempts + 1,
          );
          await new Promise((resolve) => setTimeout(resolve, 50));
          fallbackAttempts++;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await videoRef.current.play();
          console.log('Fallback video playing');
          setIsCapturing(true);
        } else {
          console.error('Video element never rendered (fallback)');
          alert(
            'Camera interface failed to load. Please refresh and try again.',
          );
        }
      } catch (fallbackError) {
        console.error('Fallback camera access failed:', fallbackError);
        alert(
          'Could not access camera. Please check permissions and try again.',
        );
      }
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      try {
        const file = new File([blob], 'phone-image.jpg', {
          type: 'image/jpeg',
        });
        const storageId = await uploadImage({
          file: await file.arrayBuffer(),
          contentType: 'image/jpeg',
        });

        // Store the storage ID and preview URL without creating the phone yet
        setImageStorageIds((prev) => [...prev, storageId]);
        const imageUrl = URL.createObjectURL(blob);
        setImages((prev) => [...prev, imageUrl]);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      }
    }, 'image/jpeg');
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        const storageId = await uploadImage({
          file: await file.arrayBuffer(),
          contentType: file.type,
        });

        // Store the storage ID and preview URL without creating the phone yet
        setImageStorageIds((prev) => [...prev, storageId]);
        const imageUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, imageUrl]);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload image');
      }
    }
  };

  const handleSubmit = async () => {
    if (!ownerIdentifier.trim()) {
      alert('Please enter your name or identifier');
      return;
    }

    // Check if all condition questions have been answered
    const allQuestionsAnswered = CONDITION_QUESTIONS.every(
      (_, index) => conditionAnswers[index.toString()] !== undefined,
    );
    if (!allQuestionsAnswered) {
      alert('Please answer all condition questions');
      return;
    }

    try {
      // Convert conditionAnswers to Record<string, boolean> (filter out undefined)
      const finalAnswers: Record<string, boolean> = {};
      Object.keys(conditionAnswers).forEach((key) => {
        const value = conditionAnswers[key];
        if (value !== undefined) {
          finalAnswers[key] = value;
        }
      });

      if (imageStorageIds.length > 0) {
        // Create phone with images
        await createPhoneWithImages({
          ownerIdentifier,
          partStatuses,
          conditionAnswers: finalAnswers,
          imageIds: imageStorageIds,
        });
      } else {
        // Create phone without images
        await createPhone({
          ownerIdentifier,
          partStatuses,
          conditionAnswers: finalAnswers,
        });
      }
      router.push('/');
    } catch (error) {
      console.error('Error creating phone:', error);
      alert('Failed to create phone');
    }
  };

  return (
    <main className='min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='mb-8'>
          <Link href='/'>
            <Button
              variant='outline'
              className='border-teal-500/30 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 hover:text-teal-400'>
              ← Back
            </Button>
          </Link>
        </div>

        <Card className='bg-slate-800 border-teal-500/30 shadow-2xl'>
          <CardHeader>
            <CardTitle className='text-2xl text-white'>
              Register Your Device
            </CardTitle>
            <p className='text-sm text-gray-400 mt-2'>
              Document your phone&apos;s condition and component status for
              responsible recycling
            </p>
          </CardHeader>
          <CardContent className='space-y-8'>
            {/* Owner/Identifier Section */}
            <div className='space-y-2'>
              <Label
                htmlFor='ownerIdentifier'
                className='text-white font-semibold'>
                Your Name or Identifier *
              </Label>
              <Input
                id='ownerIdentifier'
                value={ownerIdentifier}
                onChange={(e) => setOwnerIdentifier(e.target.value)}
                placeholder='John Doe, or Device ID'
                className='bg-slate-800/50 border-teal-500/30 text-white placeholder:text-gray-500 focus:border-teal-500/80'
              />
            </div>

            {/* Device Condition Questions Section */}
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold text-white flex items-center gap-2 mb-4'>
                  <span className='w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold'>
                    1
                  </span>
                  Device Condition Assessment
                </h3>
                <p className='text-sm text-gray-400 mb-4'>
                  Answer these questions to assess your device&apos;s condition.
                  Component statuses will be automatically calculated based on
                  your answers.
                </p>
              </div>
              <div className='space-y-3'>
                {CONDITION_QUESTIONS.map((question, index) => (
                  <div
                    key={index}
                    className='bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 space-y-3'>
                    <label className='text-sm font-medium text-white block'>
                      {index + 1}. {question}
                    </label>
                    <div className='flex gap-3'>
                      <Button
                        type='button'
                        size='sm'
                        onClick={() =>
                          setConditionAnswers((prev) => ({
                            ...prev,
                            [index.toString()]: true,
                          }))
                        }
                        className={`flex-1 transition-all ${
                          conditionAnswers[index.toString()] === true
                            ? 'bg-emerald-500/30 border-emerald-500/50 text-emerald-400 border'
                            : 'bg-slate-700/50 border-slate-600/50 text-gray-400 border hover:bg-slate-600/50'
                        }`}
                        variant='outline'>
                        ✓ Yes
                      </Button>
                      <Button
                        type='button'
                        size='sm'
                        onClick={() =>
                          setConditionAnswers((prev) => ({
                            ...prev,
                            [index.toString()]: false,
                          }))
                        }
                        className={`flex-1 transition-all ${
                          conditionAnswers[index.toString()] === false
                            ? 'bg-red-500/30 border-red-500/50 text-red-400 border'
                            : 'bg-slate-700/50 border-slate-600/50 text-gray-400 border hover:bg-slate-600/50'
                        }`}
                        variant='outline'>
                        ✗ No
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-calculated Component Classification Section */}
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold text-white flex items-center gap-2 mb-4'>
                  <span className='w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold'>
                    2
                  </span>
                  Component Classification
                  <span className='ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full'>
                    Auto-calculated
                  </span>
                </h3>
                <p className='text-sm text-gray-400 mb-4'>
                  {Object.keys(partStatuses).length > 0
                    ? "Based on your answers, here's the classification for each component. Recyclable parts recover valuable materials. Disposable parts require proper handling."
                    : 'Complete the condition assessment above to see the classification for each component.'}
                </p>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {PARTS_CLASSIFICATIONS.map((part) => {
                  const status = partStatuses[part] || 'Pending assessment';
                  const isPending = !partStatuses[part];
                  const isRecyclable = status?.includes('Recyclable');
                  const isHazardous = status?.includes('Hazardous');
                  const isContaminated = status?.includes('Contaminated');
                  const isBroken =
                    status?.includes('Broken') || status?.includes('Damaged');
                  const isFaulty =
                    status?.includes('Faulty') ||
                    status?.includes('Non-functional');

                  return (
                    <div
                      key={part}
                      className={`bg-slate-800/30 border rounded-lg p-3 ${
                        isPending
                          ? 'border-slate-700/50'
                          : isRecyclable && !status.includes('requires testing')
                            ? 'border-emerald-500/30'
                            : isHazardous
                              ? 'border-red-500/30'
                              : isContaminated
                                ? 'border-orange-500/30'
                                : isBroken || isFaulty
                                  ? 'border-yellow-500/30'
                                  : 'border-cyan-500/30'
                      }`}>
                      <div className='flex items-start justify-between gap-2'>
                        <span className='text-white font-medium text-sm'>
                          {part}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded shrink-0 ${
                            isPending
                              ? 'bg-slate-700/50 text-gray-400'
                              : isRecyclable &&
                                  !status.includes('requires testing')
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : isHazardous
                                  ? 'bg-red-500/20 text-red-400'
                                  : isContaminated
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : isBroken || isFaulty
                                      ? 'bg-yellow-500/20 text-yellow-400'
                                      : 'bg-cyan-500/20 text-cyan-400'
                          }`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Photos Section */}
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold text-white flex items-center gap-2 mb-4'>
                  <span className='w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm font-bold'>
                    {Object.keys(partStatuses).length > 0 ? '3' : '2'}
                  </span>
                  Device Photos
                </h3>
                <p className='text-sm text-gray-400 mb-4'>
                  Photos help document the device condition. Gray boxes will be
                  replaced with your images.
                </p>
              </div>

              {images.length > 0 && (
                <div className='rounded-lg border border-teal-500/20 bg-slate-800/30 p-4'>
                  <p className='text-sm text-gray-400 mb-3'>
                    {images.length} image{images.length !== 1 ? 's' : ''}{' '}
                    captured
                  </p>
                  <div className='grid grid-cols-2 gap-3'>
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className='relative w-full h-32 rounded-lg overflow-hidden border border-slate-700/50'>
                        <Image
                          src={image}
                          alt={`Phone ${index + 1}`}
                          fill
                          className='object-cover'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='flex gap-3'>
                <Button
                  onClick={() => {
                    if (isCapturing) {
                      stopCamera();
                    } else {
                      startCamera();
                    }
                  }}
                  disabled={cameraLoading || hasCamera === false}
                  className={`flex-1 gap-2 ${
                    isCapturing
                      ? 'bg-red-500/30 hover:bg-red-500/40 text-red-400'
                      : 'bg-teal-500/30 hover:bg-teal-500/40 text-teal-400'
                  }`}
                  variant='outline'>
                  <Camera className='w-4 h-4' />
                  {cameraLoading
                    ? 'Loading Camera...'
                    : isCapturing
                      ? 'Stop Camera'
                      : hasCamera === false
                        ? 'No Camera'
                        : 'Take Photo'}
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant='outline'
                  className='flex-1 gap-2 bg-cyan-500/30 hover:bg-cyan-500/40 text-cyan-400 border-cyan-500/20'>
                  <Upload className='w-4 h-4' />
                  Upload
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                multiple
                onChange={handleFileUpload}
                className='hidden'
              />

              {/* Camera preview section */}
              <div
                className={`rounded-lg transition-all ${
                  isCapturing
                    ? 'border-2 border-teal-500 ring-2 ring-teal-500/20 p-4 bg-slate-800/50 space-y-4'
                    : 'hidden'
                }`}>
                <div className='text-center text-sm text-teal-400 font-medium'>
                  📹 Camera Active - Position your device and click Capture
                </div>
                <div className='relative bg-slate-950 rounded-lg overflow-hidden min-h-64 flex items-center justify-center border border-teal-500/30'>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className='w-full h-64 object-cover'
                    onLoadedData={() =>
                      console.log('Video loaded successfully')
                    }
                    onError={(e) => console.error('Video error:', e)}
                    onCanPlay={() => console.log('Video can play')}
                    style={{
                      minHeight: '256px',
                      maxHeight: '400px',
                    }}
                  />
                  {!videoRef.current?.srcObject && isCapturing && (
                    <div className='absolute inset-0 flex items-center justify-center text-teal-400 text-sm'>
                      Loading camera...
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      captureImage();
                    }}
                    className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white gap-2'
                    size='lg'>
                    ⭕ Capture
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className='w-full bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 font-semibold py-6 text-lg'
              size='lg'>
              Save Device
            </Button>
          </CardContent>
        </Card>

        <canvas ref={canvasRef} className='hidden' />
      </div>
    </main>
  );
}
