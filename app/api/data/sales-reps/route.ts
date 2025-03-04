import { NextResponse } from 'next/server';
import { getSeedData } from '@/data/seedDataLoader';

export async function GET() {
  try {
    // Get sales reps from seed data (these could come from a database in a real app)
    const { salesReps } = getSeedData();
    
    // Add IDs to match the expected format in your components
    const salesRepsWithIds = salesReps.map((rep, index) => ({
      id: (index + 1).toString(),
      name: rep.name
    }));
    
    return NextResponse.json(salesRepsWithIds);
  } catch (error) {
    console.error('Error fetching sales reps:', error);
    return NextResponse.json(
      { message: 'Failed to fetch sales representatives', error: String(error) },
      { status: 500 }
    );
  }
}