'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createOffer } from '@/store/slices/offerSlice';
import { AppDispatch } from '@/store';
import OfferForm from '@/components/offers/OfferForm';
import PageHeader from '@/components/ui/PageHeader';
import { toast } from 'sonner';

export default function NewOfferPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting offer data:', data);
      const result = await dispatch(createOffer(data)).unwrap();
      console.log('Offer created:', result);
      toast('Offer has been created successfully');
      router.push('/offers');
    } catch (error: any) {
      console.error('Error creating offer:', error);
      toast('Failed to create offer');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <PageHeader title="Create New Offer" />
      <div className="mt-6">
        <OfferForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}