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

const PART_STATUSES = [
  'Recyclable',
  'Disposable (Hazardous)',
  'Disposable (Contaminated)',
  'Disposable (Non-functional)',
];

export default function AddPhone() {
  const [ownerIdentifier, setOwnerIdentifier] = useState('');
  const [partStatuses, setPartStatuses] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      PARTS_CLASSIFICATIONS.forEach((part) => {
        initial[part] = '';
      });
      return initial;
    },
  );
  const [conditionAnswers, setConditionAnswers] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    CONDITION_QUESTIONS.forEach((_, index) => {
      initial[index.toString()] = false;
    });
    return initial;
  });
  const [images, setImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [phoneId, setPhoneId] = useState<Id<'phones'> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPhone = useMutation(api.index.createPhone);
  const uploadImage = useAction(api.index.uploadImage);
  const addImageToPhone = useMutation(api.index.addImageToPhone);
  const router = useRouter();

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

        if (!phoneId) {
          const newPhoneId = await createPhone({
            ownerIdentifier,
            partStatuses,
            conditionAnswers,
          });
          setPhoneId(newPhoneId);
          await addImageToPhone({ phoneId: newPhoneId, imageId: storageId });
        } else {
          await addImageToPhone({ phoneId, imageId: storageId });
        }

        // Add to local state for preview
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

        if (!phoneId) {
          const newPhoneId = await createPhone({
            ownerIdentifier,
            partStatuses,
            conditionAnswers,
          });
          setPhoneId(newPhoneId);
          await addImageToPhone({ phoneId: newPhoneId, imageId: storageId });
        } else {
          await addImageToPhone({ phoneId, imageId: storageId });
        }

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

    // Check if all parts have a status assigned
    const allPartsAssigned = PARTS_CLASSIFICATIONS.every(
      (part) => partStatuses[part] && partStatuses[part].trim(),
    );
    if (!allPartsAssigned) {
      alert('Please assign a status to all phone parts');
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

    if (!phoneId && images.length === 0) {
      // Create phone without images
      try {
        await createPhone({
          ownerIdentifier,
          partStatuses,
          conditionAnswers,
        });
        router.push('/');
      } catch (error) {
        console.error('Error creating phone:', error);
        alert('Failed to create phone');
      }
    } else {
      router.push('/');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='mb-6'>
          <Link href='/'>
            <Button variant='ghost'>← Back</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Phone for Recycling</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Owner/Identifier Section */}
            <div>
              <Label htmlFor='ownerIdentifier'>Your Name or Identifier *</Label>
              <Input
                id='ownerIdentifier'
                value={ownerIdentifier}
                onChange={(e) => setOwnerIdentifier(e.target.value)}
                placeholder='Enter your name or phone identifier'
                className='mt-1'
              />
            </div>

            {/* Phone Parts Classification Section */}
            <div className='border-t pt-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Phone Parts Classification
              </h3>
              <div className='space-y-4'>
                {PARTS_CLASSIFICATIONS.map((part) => (
                  <div key={part}>
                    <Label htmlFor={`part-${part}`}>{part} *</Label>
                    <select
                      id={`part-${part}`}
                      value={partStatuses[part] || ''}
                      onChange={(e) =>
                        setPartStatuses((prev) => ({
                          ...prev,
                          [part]: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1'
                      required>
                      <option value=''>Select status</option>
                      {PART_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Condition Questions Section */}
            <div className='border-t pt-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Device Condition Questions
              </h3>
              <div className='space-y-4'>
                {CONDITION_QUESTIONS.map((question, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 border border-gray-200 rounded-lg'>
                    <label className='text-sm font-medium flex-1'>
                      {question}
                    </label>
                    <div className='flex gap-2 ml-4'>
                      <Button
                        type='button'
                        variant={
                          conditionAnswers[index.toString()] === true
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() =>
                          setConditionAnswers((prev) => ({
                            ...prev,
                            [index.toString()]: true,
                          }))
                        }
                        className='w-12'>
                        Yes
                      </Button>
                      <Button
                        type='button'
                        variant={
                          conditionAnswers[index.toString()] === false
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() =>
                          setConditionAnswers((prev) => ({
                            ...prev,
                            [index.toString()]: false,
                          }))
                        }
                        className='w-12'>
                        No
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos Section */}
            <div className='border-t pt-6'>
              <Label>Photos</Label>
              <div className='mt-2 space-y-4'>
                {images.length > 0 && (
                  <div className='grid grid-cols-2 gap-4'>
                    {images.map((image, index) => (
                      <div key={index} className='relative w-full h-32'>
                        <Image
                          src={image}
                          alt={`Phone ${index + 1}`}
                          fill
                          className='object-cover rounded-lg'
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className='flex gap-2'>
                  <Button
                    onClick={() => {
                      console.log(
                        'Camera button clicked, isCapturing:',
                        isCapturing,
                        'cameraLoading:',
                        cameraLoading,
                      );
                      if (isCapturing) {
                        stopCamera();
                      } else {
                        startCamera();
                      }
                    }}
                    disabled={cameraLoading || hasCamera === false}
                    variant={isCapturing ? 'destructive' : 'default'}
                    className='flex-1'>
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
                    className='flex-1'>
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

                {/* Camera preview section - unchanged */}
                <div
                  className={`space-y-4 ${isCapturing ? 'border-2 border-blue-500 rounded-lg p-4 bg-blue-50' : 'hidden'}`}>
                  <div className='text-center text-sm text-blue-600 font-medium mb-2'>
                    Camera Active - Click Capture to take photo
                  </div>
                  <div className='relative bg-black rounded-lg overflow-hidden min-h-64 flex items-center justify-center border-2 border-gray-300'>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className='w-full h-64 object-cover rounded-lg border-2 border-white'
                      onLoadedData={() =>
                        console.log('Video loaded successfully')
                      }
                      onError={(e) => console.error('Video error:', e)}
                      onCanPlay={() => console.log('Video can play')}
                      onPlay={() => console.log('Video started playing')}
                      style={{
                        minHeight: '256px',
                        maxHeight: '400px',
                        backgroundColor: '#000',
                      }}
                    />
                    {!videoRef.current?.srcObject && isCapturing && (
                      <div className='absolute inset-0 flex items-center justify-center text-white text-lg'>
                        Loading camera...
                      </div>
                    )}
                    <Button
                      onClick={() => {
                        console.log('Capture button clicked');
                        captureImage();
                      }}
                      className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-red-500 hover:bg-red-600'
                      size='lg'>
                      Capture
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleSubmit} className='w-full' size='lg'>
              Save Phone
            </Button>
          </CardContent>
        </Card>

        <canvas ref={canvasRef} className='hidden' />
      </div>
    </div>
  );
}
