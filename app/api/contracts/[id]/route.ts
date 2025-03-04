import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/models';
import { Contract } from '@/models/Contract';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  
  try {
    const contract = await Contract.findById(params.id)
      .populate('clientId')
      .populate('offerId');
    
    if (!contract) {
      return NextResponse.json({ message: 'Contract not found' }, { status: 404 });
    }
    
    return NextResponse.json(contract);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching contract', error }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  
  try {
    const data = await request.json();
    const updatedContract = await Contract.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    )
      .populate('clientId')
      .populate('offerId');
    
    if (!updatedContract) {
      return NextResponse.json({ message: 'Contract not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedContract);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating contract', error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  
  try {
    const deletedContract = await Contract.findByIdAndDelete(params.id);
    
    if (!deletedContract) {
      return NextResponse.json({ message: 'Contract not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting contract', error }, { status: 500 });
  }
}