import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Use a default userId for now (in production, use session.user.id)
    const userId = 'default-user';

    let settings = await Settings.findOne({ userId });

    // If no settings exist, create default settings
    if (!settings) {
      settings = await Settings.create({
        userId,
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@test.com',
          bio: '',
        },
        notifications: {
          emailNotifications: true,
          pushNotifications: true,
          leadUpdates: true,
          teamMentions: true,
        },
        appearance: {
          theme: 'light',
          accentColor: '#6366f1',
        },
        language: 'en',
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await dbConnect();

    const userId = 'default-user';

    const settings = await Settings.findOneAndUpdate(
      { userId },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
