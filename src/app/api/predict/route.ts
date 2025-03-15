import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { submit_date } = body;
    
    if (!submit_date) {
      return NextResponse.json(
        { message: 'Submit date is required' },
        { status: 400 }
      );
    }
    
    // Parse the submit date
    const submitDate = new Date(submit_date);
    
    // Add a random number of days (120-180) to simulate processing time
    const processingDays = Math.floor(Math.random() * 60) + 120;
    const predictedDate = new Date(submitDate);
    predictedDate.setDate(predictedDate.getDate() + processingDays);
    
    // Generate a confidence level
    const confidence = Math.floor(Math.random() * 15) + 80;
    
    return NextResponse.json({
      submit_date: submit_date,
      predicted_completion: predictedDate.toISOString().split('T')[0],
      confidence: confidence
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { message: 'Failed to process prediction' },
      { status: 500 }
    );
  }
} 