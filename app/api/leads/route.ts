import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'position';

    let query: any = {};
    if (status) {
      query.status = status;
    }

    let sortOption: any = {};
    if (sort === 'priority') {
      sortOption = { priority: -1, position: 1 };
    } else if (sort === 'date') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    } else {
      sortOption = { position: 1 };
    }

    const leads = await Lead.find(query).sort(sortOption);

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, company, value, status, priority, notes } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await dbConnect();

    const maxPositionLead = await Lead.findOne({ status: status || 'new' })
      .sort({ position: -1 })
      .limit(1);

    const position = maxPositionLead ? maxPositionLead.position + 1 : 0;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      value,
      status: status || 'new',
      priority: priority || 'medium',
      notes,
      assignedTo: session.userId,
      position,
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
