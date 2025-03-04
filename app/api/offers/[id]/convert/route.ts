import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/models';
import { Offer, OfferStatus } from '@/models/schemas/Offer';
import { Contract } from '@/models/Contract';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  
  try {
    // Find the offer and check if it's accepted
    const offer = await Offer.findById(params.id);
    
    if (!offer) {
      return NextResponse.json({ message: 'Offer not found' }, { status: 404 });
    }
    
    if (offer.status !== OfferStatus.ACCEPTED) {
      return NextResponse.json({ 
        message: 'Only accepted offers can be converted to contracts' 
      }, { status: 400 });
    }
    
    // Create a new contract based on the offer
    const newContract = new Contract({
      title: `Contract based on ${offer.title}`,
      description: offer.description,
      clientId: offer.clientId,
      offerId: offer._id,
      responsiblePerson: offer.salesRepresentative,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now by default
      paymentTerms: 'Net 30',
      amount: offer.amount,
      notes: `Created from offer ${offer._id}`
    });
    
    // Save the new contract
    const savedContract = await newContract.save();
    
    // Return the contract and offer
    return NextResponse.json({ 
      contract: savedContract,
      offer: offer
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error converting offer to contract', error }, { status: 500 });
  }
}