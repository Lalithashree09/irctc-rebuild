import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const dateStr = searchParams.get('date');

    if (!from || !to || !dateStr) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const searchDate = new Date(dateStr);
        searchDate.setHours(0, 0, 0, 0);

        // Find trains that have a route passing through 'from' station AND 'to' station
        // AND 'from' station sequence < 'to' station sequence

        const fromStation = await prisma.station.findUnique({ where: { code: from } });
        const toStation = await prisma.station.findUnique({ where: { code: to } });

        if (!fromStation || !toStation) {
            return NextResponse.json({ error: 'Invalid station codes' }, { status: 404 });
        }

        // This is a simplified query. In a real app, this would be more optimized.
        const trains = await prisma.train.findMany({
            where: {
                AND: [
                    {
                        routes: {
                            some: {
                                stationId: fromStation.id
                            }
                        }
                    },
                    {
                        routes: {
                            some: {
                                stationId: toStation.id
                            }
                        }
                    }
                ]
            },
            include: {
                routes: {
                    orderBy: {
                        sequenceOrder: 'asc'
                    },
                    include: {
                        station: true
                    }
                },
                schedules: {
                    where: {
                        date: searchDate
                    }
                }
            }
        });

        // Filter trains where 'from' comes before 'to'
        const validTrains = trains.filter(train => {
            const fromRoute = train.routes.find(r => r.stationId === fromStation.id);
            const toRoute = train.routes.find(r => r.stationId === toStation.id);

            return fromRoute && toRoute && fromRoute.sequenceOrder < toRoute.sequenceOrder;
        });

        return NextResponse.json(validTrains);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
