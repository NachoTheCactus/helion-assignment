'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContracts } from '@/store/slices/contractSlice';
import { RootState, AppDispatch } from '@/store';
import PageHeader from '@/components/ui/PageHeader';
import ContractsList from '@/components/contracts/ContractsList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ContractsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { contracts, isLoading, error } = useSelector((state: RootState) => state.contracts);
  
  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);
  
  const handleCreateContract = () => {
    router.push('/contracts/new');
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
        title="Contracts" 
        action={{ label: 'Create Contract', onClick: handleCreateContract }}
      />
      <div className="mt-6">
        <ContractsList contracts={contracts} />
      </div>
    </div>
  );
}