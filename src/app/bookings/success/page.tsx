'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';
import styles from './page.module.css';

function BookingSuccessContent() {
    const searchParams = useSearchParams();
    const pnr = searchParams.get('pnr');

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.card}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
            >
                <div className={styles.iconWrapper}>
                    <CheckCircle size={64} color="#4ade80" />
                </div>

                <h1 className={styles.title}>Booking Confirmed!</h1>
                <p className={styles.message}>Your ticket has been successfully booked.</p>

                <div className={styles.pnrBox}>
                    <span className={styles.pnrLabel}>PNR Number</span>
                    <span className={styles.pnrValue}>{pnr}</span>
                </div>

                <div className={styles.actions}>
                    <Link href="/" className={styles.homeBtn}>
                        Back to Home
                    </Link>
                    <Link href="/bookings" className={styles.viewBtn}>
                        View My Bookings
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function BookingSuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingSuccessContent />
        </Suspense>
    );
}
