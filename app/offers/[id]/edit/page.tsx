'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOffers, updateOffer, setCurrentOffer } from '@/store/slices/offerSlice';
import { RootState, AppDispatch } from '@/store';
import OfferForm from '@/components/offers/OfferForm';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

export default function EditOfferPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { offers, currentOffer, isLoading, error } = useSelector((state: RootState) => state.offers);
  
  useEffect(() => {
    if (offers.length === 0) {
      dispatch(fetchOffers());
    } else {
      const offer = offers.find((o) => o._id === params.id);
      if (offer) {
        dispatch(setCurrentOffer(offer));
      }
    }
  }, [dispatch, offers, params.id]);
  
  const handleSubmit = async (data: any) => {
    if (!currentOffer) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(updateOffer({ id: params.id, data })).unwrap();
      toast('Offer has been updated successfully');
      router.push(`/offers/${params.id}`);
    } catch (error: any) {
      toast('Failed to update offer');
      console.error(error)
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error: {error}
      </div>
    );
  }
  
  if (!currentOffer) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-500 rounded-md">
        Offer not found
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader title="Edit Offer" />
      <div className="mt-6">
        <OfferForm 
          initialData={currentOffer} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}