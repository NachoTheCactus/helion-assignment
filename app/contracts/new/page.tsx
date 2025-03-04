'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createContract } from '@/store/slices/contractSlice';
import { AppDispatch } from '@/store';
import ContractForm from '@/components/contracts/ContractForm';
import PageHeader from '@/components/ui/PageHeader';
import { toast } from 'sonner';

export default function NewContractPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await dispatch(createContract(data)).unwrap();
      toast('Contract has been created successfully');
      router.push('/contracts');
    } catch (error: any) {
      toast('Failed to create contract');
      console.error(error)
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <PageHeader title="Create New Contract" />
      <div className="mt-6">
        <ContractForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}