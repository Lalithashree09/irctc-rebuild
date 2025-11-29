import prisma from '@/lib/prisma';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

async function getAdminStats() {
    const [userCount, trainCount, bookingCount, revenue] = await Promise.all([
        prisma.user.count(),
        prisma.train.count(),
        prisma.booking.count(),
        prisma.booking.aggregate({
            _sum: {
                totalAmount: true
            }
        })
    ]);

    const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: true,
            schedule: {
                include: { train: true }
            }
        }
    });

    return {
        userCount,
        trainCount,
        bookingCount,
        revenue: revenue._sum.totalAmount || 0,
        recentBookings
    };
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>
                <button className={styles.addBtn}>+ Add New Train</button>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Revenue</div>
                    <div className={styles.statValue}>₹{stats.revenue.toLocaleString()}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Bookings</div>
                    <div className={styles.statValue}>{stats.bookingCount}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Active Trains</div>
                    <div className={styles.statValue}>{stats.trainCount}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Registered Users</div>
                    <div className={styles.statValue}>{stats.userCount}</div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent Bookings</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>PNR</th>
                                <th>User</th>
                                <th>Train</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.pnr}</td>
                                    <td>{booking.user.name || booking.user.email}</td>
                                    <td>{booking.schedule.train.name}</td>
                                    <td>{new Date(booking.schedule.date).toLocaleDateString()}</td>
                                    <td>₹{booking.totalAmount}</td>
                                    <td>{booking.status}</td>
                                    <td>
                                        <button className={styles.actionBtn}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
