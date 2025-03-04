import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/models';
import { Client } from '@/models/schemas/Client';

export async function GET() {
  await connectDB();
  
  try {
    const clients = await Client.find().sort({ name: 1 });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching clients', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  
  try {
    const data = await request.json();
    const newClient = new Client(data);
    const savedClient = await newClient.save();
    return NextResponse.json(savedClient, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating client', error }, { status: 500 });
  }
}