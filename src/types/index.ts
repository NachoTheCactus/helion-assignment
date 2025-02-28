export type Client = {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  
  export type SalesRepresentative = {
    id: string;
    name: string;
    email: string;
  };
  
  export type OfferStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  
  export type Offer = {
    id: string;
    title: string;
    description: string;
    client: Client;
    salesRepresentative: SalesRepresentative;
    validFrom: string; // ISO date string
    validTo: string; // ISO date string
    price: number;
    status: OfferStatus;
    notes: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
  
  export type ContractStatus = 'Draft' | 'Active' | 'Suspended' | 'Terminated' | 'Completed';
  
  export type Contract = {
    id: string;
    title: string;
    description: string;
    client: Client;
    responsiblePerson: SalesRepresentative;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    paymentTerms: string;
    totalValue: number;
    status: ContractStatus;
    notes: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    relatedOfferId?: string; // Optional, if created from an offer
  };