'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOffers, updateOffer, convertOfferToContract, setCurrentOffer } from '@/store/slices/offerSlice';
import { RootState, AppDispatch } from '@/store';
import PageHeader from '@/components/ui/PageHeader';
import OfferDetail from '@/components/offers/OfferDetail';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { OfferStatus } from '@/types/offer';

export default function OfferDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
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
  
  const handleStatusChange = async (status: OfferStatus) => {
    if (!currentOffer) return;
    
    try {
      await dispatch(updateOffer({ 
        id: currentOffer._id, 
        data: { ...currentOffer, status } 
      })).unwrap();
      
      toast(`Offer status has been updated to ${status}`);
    } catch (error: any) {
      console.error(error)
      toast('Failed to update offer status');
    }
  };
  
  const handleConvertToContract = async () => {
    if (!currentOffer) return;
    
    try {
      await dispatch(convertOfferToContract(currentOffer._id)).unwrap();
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
  
  if (!currentOffer) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-500 rounded-md">
        Offer not found
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader title="Offer Details" />
      <div className="mt-6">
        <OfferDetail 
          offer={currentOffer} 
          onStatusChange={handleStatusChange}
          onConvertToContract={handleConvertToContract}
        />
      </div>
    </div>
  );
}