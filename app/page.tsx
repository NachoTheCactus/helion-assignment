'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { fetchOffers } from '@/store/slices/offerSlice';
import { fetchContracts } from '@/store/slices/contractSlice';
import { fetchClients } from '@/store/slices/clientSlice';
import { RootState, AppDispatch } from '@/store';
import { OfferStatus } from '@/types/offer';
import { ContractStatus } from '@/types/contract';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  
  const { offers, isLoading: offersLoading } = useSelector((state: RootState) => state.offers);
  const { contracts, isLoading: contractsLoading } = useSelector((state: RootState) => state.contracts);
  const { clients, isLoading: clientsLoading } = useSelector((state: RootState) => state.clients);
  
  useEffect(() => {
    dispatch(fetchOffers());
    dispatch(fetchContracts());
    dispatch(fetchClients());
  }, [dispatch]);
  
  const isLoading = offersLoading || contractsLoading || clientsLoading;
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Calculate statistics for dashboard
  const totalOffers = offers.length;
  const activeOffers = offers.filter(
    (offer) => offer.status === OfferStatus.DRAFT || offer.status === OfferStatus.SENT
  ).length;
  const acceptedOffers = offers.filter(
    (offer) => offer.status === OfferStatus.ACCEPTED
  ).length;
  
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(
    (contract) => contract.status === ContractStatus.ACTIVE
  ).length;
  const completedContracts = contracts.filter(
    (contract) => contract.status === ContractStatus.COMPLETED
  ).length;
  
  const totalClients = clients.length;
  
  return (
    <div>
      <PageHeader 
        title="Dashboard" 
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOffers}</div>
            <p className="text-xs text-gray-500">
              {activeOffers} active • {acceptedOffers} accepted
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
            <p className="text-xs text-gray-500">
              {activeContracts} active • {completedContracts} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}