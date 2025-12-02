import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
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

    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
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
    const { clientName, clientEmail, service, amount, status, dueDate, issueDate, notes } = body;

    if (!clientName || !service || amount === undefined || !dueDate) {
      return NextResponse.json({ error: 'Client name, service, amount, and due date are required' }, { status: 400 });
    }

    await dbConnect();

    // Generate invoice number
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${String(count + 1).padStart(3, '0')}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      clientName,
      clientEmail,
      service,
      amount,
      status: status || 'pending',
      dueDate: new Date(dueDate),
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      notes,
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
