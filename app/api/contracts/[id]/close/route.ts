import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/models';
import { Contract, ContractStatus } from '@/models/Contract';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  
  try {
    const { status } = await request.json();
    
    if (!status || !Object.values(ContractStatus).includes(status)) {
      return NextResponse.json({ message: 'Invalid status provided' }, { status: 400 });
    }
    
    const updatedContract = await Contract.findByIdAndUpdate(
      params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('clientId')
      .populate('offerId');
    
    if (!updatedContract) {
      return NextResponse.json({ message: 'Contract not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedContract);
  } catch (error) {
    return NextResponse.json({ message: 'Error closing contract', error }, { status: 500 });
  }
}