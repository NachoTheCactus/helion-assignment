import { connectDatabase, disconnectDatabase } from '../config/db';
import Client from '../models/Client';
import SalesRepresentative from '../models/SalesRepresentative';
import Offer from '../models/Offer';
import Contract from '../models/Contract';

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    console.log('Starting database seeding...');
    
    // Clear existing data
    await Client.deleteMany({});
    await SalesRepresentative.deleteMany({});
    await Offer.deleteMany({});
    await Contract.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Create clients
    const clients = await Client.create([
      { 
        name: 'Acme Corp', 
        email: 'info@acme.com', 
        phone: '123-456-7890', 
        company: 'Acme Corporation' 
      },
      { 
        name: 'Globex', 
        email: 'contact@globex.com', 
        phone: '987-654-3210', 
        company: 'Globex International' 
      },
      { 
        name: 'Initech', 
        email: 'sales@initech.com', 
        phone: '555-123-4567', 
        company: 'Initech Industries' 
      },
    ]);
    
    console.log(`${clients.length} clients created`);
    
    // Create sales representatives
    const salesReps = await SalesRepresentative.create([
      { 
        name: 'John Doe', 
        email: 'john.doe@helion.com' 
      },
      { 
        name: 'Jane Smith', 
        email: 'jane.smith@helion.com' 
      },
      { 
        name: 'Bob Johnson', 
        email: 'bob.johnson@helion.com' 
      },
    ]);
    
    console.log(`${salesReps.length} sales representatives created`);
    
    // Create offers
    const offers = await Offer.create([
      {
        title: 'Software Development Services',
        description: 'Custom software development for inventory management',
        client: clients[0]._id,
        salesRepresentative: salesReps[0]._id,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-04-01'),
        price: 15000,
        status: 'Sent',
        notes: 'Client is interested in expanding the scope'
      },
      {
        title: 'IT Infrastructure Audit',
        description: 'Comprehensive audit of IT systems and infrastructure',
        client: clients[1]._id,
        salesRepresentative: salesReps[1]._id,
        validFrom: new Date('2025-02-15'),
        validTo: new Date('2025-03-15'),
        price: 5000,
        status: 'Draft',
        notes: 'Need to schedule initial meeting'
      },
      {
        title: 'Web Portal Development',
        description: 'Customer-facing web portal with authentication',
        client: clients[2]._id,
        salesRepresentative: salesReps[2]._id,
        validFrom: new Date('2025-01-15'),
        validTo: new Date('2025-02-15'),
        price: 8500,
        status: 'Accepted',
        notes: 'Client approved the proposal, ready for contract'
      }
    ]);
    
    console.log(`${offers.length} offers created`);
    
    // Create contracts
    const contracts = await Contract.create([
      {
        title: 'CRM Implementation',
        description: 'Implementation of CRM system with customizations',
        client: clients[0]._id,
        responsiblePerson: salesReps[0]._id,
        startDate: new Date('2025-01-10'),
        endDate: new Date('2025-12-10'),
        paymentTerms: 'Net 30',
        totalValue: 45000,
        status: 'Active',
        notes: 'Monthly progress meetings scheduled'
      },
      {
        title: 'Web Portal Development',
        description: 'Development of customer-facing web portal with authentication',
        client: clients[2]._id,
        responsiblePerson: salesReps[2]._id,
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-05-01'),
        paymentTerms: 'Net 30',
        totalValue: 8500,
        status: 'Draft',
        relatedOffer: offers[2]._id,
        notes: 'Converting from accepted offer'
      }
    ]);
    
    console.log(`${contracts.length} contracts created`);
    
    console.log('Database seeding completed successfully');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from database
    await disconnectDatabase();
  }
};

// Run the seeder
seedDatabase();