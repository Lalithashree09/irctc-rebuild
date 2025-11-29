import prisma from '@/lib/prisma';
import styles from './page.module.css';

// Force dynamic rendering to fetch latest bookings
export const dynamic = 'force-dynamic';

async function getBookings() {
    // In a real app, we would get the userId from the session
    const userId = 'mock-user-id';

    const bookings = await prisma.booking.findMany({
        where: { userId },
        include: {
            schedule: {
                include: {
                    train: true
                }
            },
            passengers: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return bookings;
}

export default async function MyBookings() {
    const bookings = await getBookings();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Bookings</h1>

            <div className={styles.grid}>
                {bookings.map((booking) => (
                    <div key={booking.id} className={styles.card}>
                        <div className={styles.header}>
                            <div>
                                <div className={styles.pnr}>PNR: {booking.pnr}</div>
                                <div className={styles.date}>
                                    {new Date(booking.schedule.date).toLocaleDateString()}
                                </div>
                            </div>
                            <div className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>
                                {booking.status}
                            </div>
                        </div>

                        <div className={styles.trainInfo}>
                            <div className={styles.trainName}>{booking.schedule.train.name}</div>
                            <div className={styles.trainNumber}>#{booking.schedule.train.number}</div>
                        </div>

                        <div className={styles.passengers}>
                            {booking.passengers.map((p) => (
                                <div key={p.id} className={styles.passenger}>
                                    <span>{p.name}</span>
                                    <span className={styles.seat}>{p.coach} {p.seatNumber}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.footer}>
                            <div className={styles.amount}>₹{booking.totalAmount}</div>
                        </div>
                    </div>
                ))}

                {bookings.length === 0 && (
                    <div className={styles.empty}>
                        No bookings found. Start your journey today!
                    </div>
                )}
            </div>
        </div>
    );
}
