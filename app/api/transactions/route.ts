import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let query: any = {};
    if (type && type !== 'all') {
      query.type = type;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    // Calculate totals
    const allTransactions = await Transaction.find({});
    const totalIncome = allTransactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = allTransactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const pendingAmount = allTransactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return NextResponse.json({
      transactions,
      stats: {
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        pendingAmount,
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
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
    const { description, amount, type, category, date, status, reference, notes } = body;

    if (!description || amount === undefined || !type) {
      return NextResponse.json({ error: 'Description, amount, and type are required' }, { status: 400 });
    }

    await dbConnect();

    const transaction = await Transaction.create({
      description,
      amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      type,
      category,
      date: date || new Date(),
      status: status || 'pending',
      reference,
      notes,
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
