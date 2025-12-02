import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  const results = {
    mongodb: { status: 'disconnected', message: '' },
    cloudinary: { status: 'disconnected', message: '' },
  };

  // Test MongoDB connection
  try {
    await dbConnect();
    results.mongodb.status = 'connected';
    results.mongodb.message = 'MongoDB connected successfully';
  } catch (error: any) {
    results.mongodb.status = 'error';
    results.mongodb.message = error.message || 'Failed to connect to MongoDB';
  }

  // Test Cloudinary connection
  try {
    const pingResult = await cloudinary.api.ping();
    if (pingResult.status === 'ok') {
      results.cloudinary.status = 'connected';
      results.cloudinary.message = 'Cloudinary connected successfully';
    }
  } catch (error: any) {
    results.cloudinary.status = 'error';
    results.cloudinary.message = `Error: ${error.message || 'Failed to connect'} - Config: ${JSON.stringify({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY?.substring(0, 4) + '...',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'not set'
    })}`;
  }

  return NextResponse.json(results);
}
