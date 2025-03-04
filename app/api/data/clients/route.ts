import { NextResponse } from 'next/server';
import connectDB from '@/models';
import { Client } from '@/models/schemas/Client';

export async function GET() {
  await connectDB();
  
  try {
    const clients = await Client.find().sort({ name: 1 });
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { message: 'Failed to fetch clients', error: String(error) },
      { status: 500 }
    );
  }
}