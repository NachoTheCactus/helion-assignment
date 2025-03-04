'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOffers, convertOfferToContract } from '@/store/slices/offerSlice';
import { RootState, AppDispatch } from '@/store';
import PageHeader from '@/components/ui/PageHeader';
import OffersList from '@/components/offers/OffersList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

export default function OffersPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { offers, isLoading, error } = useSelector((state: RootState) => state.offers);
  
  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);
  
  const handleCreateOffer = () => {
    router.push('/offers/new');
  };
  
  const handleConvertToContract = async (offerId: string) => {
    try {
      await dispatch(convertOfferToContract(offerId)).unwrap();
      toast('Offer has been successfully converted to a contract');
      router.push('/contracts');
    } catch (error: any) {
      console.error(error)
      toast('Failed to convert offer to contract');
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
  
  return (
    <div>
      <PageHeader 
        title="Offers" 
        action={{ label: 'Create Offer', onClick: handleCreateOffer }}
      />
      <div className="mt-6">
        <OffersList 
          offers={offers} 
          onConvertToContract={handleConvertToContract} 
        />
      </div>
    </div>
  );
}