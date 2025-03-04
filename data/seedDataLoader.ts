import fs from 'fs';
import path from 'path';

interface ClientData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface SalesRepData {
  name: string;
}

interface SeedData {
  clients: ClientData[];
  salesReps: SalesRepData[];
}

let cachedData: SeedData | null = null;

export function getSeedData(): SeedData {
  if (cachedData) {
    return cachedData;
  }

  try {
    // For server-side execution
    const dataPath = path.join(process.cwd(), 'data', 'seedData.json');
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    cachedData = JSON.parse(jsonData) as SeedData;
    return cachedData;
  } catch (error) {
    // Fallback data if file cannot be read (development or client-side)
    console.warn('Could not read seed data file, using fallback data:', error);
    return {
      clients: [
        { _id: '000000000000000000000001', name: 'Acme Corp', email: 'contact@acmecorp.com', phone: '123-456-7890', address: '123 Main St, City' },
        { _id: '000000000000000000000002', name: 'Globex Industries', email: 'info@globex.com', phone: '987-654-3210', address: '456 Oak Ave, Town' },
        { _id: '000000000000000000000003', name: 'Stark Enterprises', email: 'hello@stark.com', phone: '555-123-4567', address: '789 Pine St, Village' },
        { _id: '000000000000000000000004', name: 'Wayne Enterprises', email: 'business@wayne.com', phone: '222-333-4444', address: '101 Elm St, County' },
        { _id: '000000000000000000000005', name: 'Umbrella Corporation', email: 'support@umbrella.com', phone: '777-888-9999', address: '202 Maple Dr, State' },
      ],
      salesReps: [
        { name: 'John Doe' },
        { name: 'Jane Smith' },
        { name: 'Robert Johnson' },
        { name: 'Emily Davis' },
        { name: 'Michael Brown' },
      ]
    };
  }
}