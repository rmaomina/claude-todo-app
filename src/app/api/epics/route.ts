import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { CreateEpicData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const epics = await prisma.epic.findMany({
      where: { userId: user.id },
      include: {
        stories: {
          include: {
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(epics);
  } catch (error) {
    console.error('Error fetching epics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body: CreateEpicData = await request.json();
    
    const epic = await prisma.epic.create({
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority || 'MEDIUM',
        userId: user.id,
      },
      include: {
        stories: {
          include: {
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json(epic, { status: 201 });
  } catch (error) {
    console.error('Error creating epic:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}