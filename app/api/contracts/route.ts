import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/models';
import { Contract } from '@/models/Contract';

export async function GET() {
  await connectDB();
  
  try {
    const contracts = await Contract.find()
      .sort({ createdAt: -1 })
      .populate('clientId')
      .populate('offerId');
    return NextResponse.json(contracts);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching contracts', error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  
  try {
    const data = await request.json();
    const newContract = new Contract(data);
    const savedContract = await newContract.save();
    return NextResponse.json(savedContract, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating contract', error }, { status: 500 });
  }
}