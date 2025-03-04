import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/models';
import { Offer } from '@/models/schemas/Offer';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  
  try {
    const offer = await Offer.findById(params.id).populate('clientId');
    
    if (!offer) {
      return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    }
    
    return NextResponse.json(offer);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching offer', error }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  
  try {
    const data = await request.json();
    const updatedOffer = await Offer.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).populate('clientId');
    
    if (!updatedOffer) {
      return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedOffer);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating offer', error }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  
  try {
    const deletedOffer = await Offer.findByIdAndDelete(params.id);
    
    if (!deletedOffer) {
      return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting offer', error }, { status: 500 });
  }
}