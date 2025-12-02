import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leads } = body;

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'Invalid leads data' }, { status: 400 });
    }

    await dbConnect();

    const createdLeads: any[] = [];
    const errors: { row: number; error: string }[] = [];

    for (let i = 0; i < leads.length; i++) {
      const leadData = leads[i];

      if (!leadData.name) {
        errors.push({ row: i + 1, error: 'Name is required' });
        continue;
      }

      try {
        const maxPositionLead = await Lead.findOne({ status: leadData.status || 'new' })
          .sort({ position: -1 })
          .limit(1);

        const position = maxPositionLead ? maxPositionLead.position + 1 : createdLeads.length;

        const lead = await Lead.create({
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          company: leadData.company,
          value: leadData.value || 0,
          status: leadData.status || 'new',
          priority: leadData.priority || 'medium',
          notes: leadData.notes,
          assignedTo: session.userId,
          position,
        });

        createdLeads.push(lead);
      } catch (error: any) {
        errors.push({ row: i + 1, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      created: createdLeads.length,
      errors: errors.length,
      errorDetails: errors,
      leads: createdLeads,
    });
  } catch (error) {
    console.error('Error uploading leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
