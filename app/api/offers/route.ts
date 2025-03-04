// app/api/offers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/models';
import { Offer } from '@/models/schemas/Offer';
// Import the Client model to make sure it's registered

export async function GET() {
  await connectDB();
  
  try {
    // First try without populate to confirm the basic query works
    const offers = await Offer.find().sort({ createdAt: -1 });
    console.log('Found offers:', offers.length);
    
    // Then try with populate if the basic query works
    const populatedOffers = await Offer.find().sort({ createdAt: -1 });

    return NextResponse.json(populatedOffers);
  } catch (error:any) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ message: 'Error fetching offers', error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  
  try {
    const data = await request.json();
    console.log('Creating offer with data:', data);
    
    const newOffer = new Offer(data);
    
    // Validate before saving
    const validationError = newOffer.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { message: 'Validation error', error: validationError }, 
        { status: 400 }
      );
    }
    
    const savedOffer = await newOffer.save();
    console.log('Offer created successfully:', savedOffer._id);
    return NextResponse.json(savedOffer, { status: 201 });
  } catch (error: any) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { message: 'Error creating offer', error: error.message || String(error) }, 
      { status: 500 }
    );
  }
}