import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { trainId, date, passengers, userId } = body;

        // 1. Find the schedule
        const bookingDate = new Date(date);
        bookingDate.setHours(0, 0, 0, 0);

        let schedule = await prisma.schedule.findUnique({
            where: {
                trainId_date: {
                    trainId,
                    date: bookingDate
                }
            }
        });

        if (!schedule) {
            // If no schedule exists for this date, create one (simplified logic)
            // In reality, schedules are pre-generated
            schedule = await prisma.schedule.create({
                data: {
                    trainId,
                    date: bookingDate,
                    sleeperAvailable: 100,
                    ac3TierAvailable: 80,
                    ac2TierAvailable: 50,
                    ac1TierAvailable: 20
                }
            });
        }

        // 2. Generate PNR (Random 10 digit string)
        const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        // 3. Create Booking Transaction
        const booking = await prisma.$transaction(async (tx) => {
            // Create Booking
            const newBooking = await tx.booking.create({
                data: {
                    pnr,
                    userId: userId || 'guest', // Handle guest or create a temporary user
                    scheduleId: schedule.id,
                    totalAmount: passengers.length * 1200, // Mock price
                    status: 'BOOKED',
                    passengers: {
                        create: passengers.map((p: any) => ({
                            name: p.name,
                            age: parseInt(p.age),
                            gender: p.gender,
                            seatNumber: `S1-${Math.floor(Math.random() * 72) + 1}`, // Mock seat assignment
                            coach: 'S1'
                        }))
                    }
                }
            });

            // Update Availability (Decrement Sleeper for now)
            await tx.schedule.update({
                where: { id: schedule.id },
                data: {
                    sleeperAvailable: {
                        decrement: passengers.length
                    }
                }
            });

            return newBooking;
        });

        return NextResponse.json({ pnr: booking.pnr, status: 'success' });

    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
    }
}
