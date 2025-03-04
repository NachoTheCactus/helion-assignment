const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/offer-contract-system');
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };

  const ClientSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String },
      address: { type: String },
    },
    { timestamps: true }
  );
  
  // Create the Client model
  const Client = mongoose.model('Client', ClientSchema);
  
  // Sample client data
  const clientData = [
    { name: 'Acme Corp', email: 'contact@acmecorp.com', phone: '123-456-7890', address: '123 Main St, City' },
    { name: 'Globex Industries', email: 'info@globex.com', phone: '987-654-3210', address: '456 Oak Ave, Town' },
    { name: 'Stark Enterprises', email: 'hello@stark.com', phone: '555-123-4567', address: '789 Pine St, Village' },
    { name: 'Wayne Enterprises', email: 'business@wayne.com', phone: '222-333-4444', address: '101 Elm St, County' },
    { name: 'Umbrella Corporation', email: 'support@umbrella.com', phone: '777-888-9999', address: '202 Maple Dr, State' },
  ];
  
  // Sample sales representatives data
  const salesRepData = [
    { name: 'John Doe' },
    { name: 'Jane Smith' },
    { name: 'Robert Johnson' },
    { name: 'Emily Davis' },
    { name: 'Michael Brown' },
  ];
  
  // Seed the database
  const seedDatabase = async () => {
    try {
      // Connect to the database
      await connectDB();
  
      // Clear existing data
      await Client.deleteMany({});
      console.log('Cleared existing clients');
  
      // Insert client data
      const clients = await Client.insertMany(clientData);
      console.log('Clients added to the database:');
      
      // Log the created clients with their IDs
      clients.forEach(client => {
        console.log(`- ${client.name} (ID: ${client._id})`);
      });
  
      console.log('\nUse these IDs in your application.');
      
      // Create a JSON file with client data
      const fs = require('fs');
      const path = require('path');
      
      const clientsJson = clients.map(client => ({
        _id: client._id.toString(),
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      }));
      
      // Create data directory if it doesn't exist
      const dataDir = path.join(__dirname, '..', 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }
      
      // Write the data to a JSON file
      fs.writeFileSync(
        path.join(dataDir, 'seedData.json'), 
        JSON.stringify({ clients: clientsJson, salesReps: salesRepData }, null, 2)
      );
      
      console.log('Data saved to data/seedData.json');
      
      console.log('Database seeding completed successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      // Close the connection
      mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  };
  
  // Run the seeder
  seedDatabase();