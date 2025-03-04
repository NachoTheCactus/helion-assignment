'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContracts, updateContract, setCurrentContract } from '@/store/slices/contractSlice';
import { RootState, AppDispatch } from '@/store';
import ContractForm from '@/components/contracts/ContractForm';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

export default function EditContractPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { contracts, currentContract, isLoading, error } = useSelector((state: RootState) => state.contracts);
  
  useEffect(() => {
    if (contracts.length === 0) {
      dispatch(fetchContracts());
    } else {
      const contract = contracts.find((c) => c._id === params.id);
      if (contract) {
        dispatch(setCurrentContract(contract));
      }
    }
  }, [dispatch, contracts, params.id]);
  
  const handleSubmit = async (data: any) => {
    if (!currentContract) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(updateContract({ id: params.id, data })).unwrap();
      toast('Contract has been updated successfully');
      router.push(`/contracts/${params.id}`);
    } catch (error: any) {
      toast('Failed to update contract');
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
  
  if (!currentContract) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-500 rounded-md">
        Contract not found
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader title="Edit Contract" />
      <div className="mt-6">
        <ContractForm 
          initialData={currentContract} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}