'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContracts, closeContract, setCurrentContract } from '@/store/slices/contractSlice';
import { RootState, AppDispatch } from '@/store';
import PageHeader from '@/components/ui/PageHeader';
import ContractDetail from '@/components/contracts/ContractDetail';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { ContractStatus } from '@/types/contract';

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  
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
  
  const handleStatusChange = async (status: ContractStatus) => {
    if (!currentContract) return;
    
    try {
      await dispatch(closeContract({ id: currentContract._id, status })).unwrap();
      
      toast(`Contract status has been updated to ${status}`);
    } catch (error: any) {
      console.error(error)
      toast('Failed to update contract status');
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
      <PageHeader title="Contract Details" />
      <div className="mt-6">
        <ContractDetail 
          contract={currentContract} 
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
