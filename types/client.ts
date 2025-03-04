export interface IClientClient {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
  }