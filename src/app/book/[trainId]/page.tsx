'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';

interface Passenger {
    name: string;
    age: string;
    gender: string;
}

export default function BookingPage({ params }: { params: { trainId: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const date = searchParams.get('date');

    const [passengers, setPassengers] = useState<Passenger[]>([
        { name: '', age: '', gender: 'Male' }
    ]);
    const [loading, setLoading] = useState(false);

    const addPassenger = () => {
        setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
    };

    const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
        const newPassengers = [...passengers];
        newPassengers[index][field] = value;
        setPassengers(newPassengers);
    };

    const handleBooking = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trainId: params.trainId,
                    date,
                    passengers,
                    // Mock user ID for now, in real app get from session
                    userId: 'mock-user-id'
                })
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/bookings/success?pnr=${data.pnr}`);
            } else {
                alert('Booking failed');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Complete Your Booking</h1>
                <p className={styles.subtitle}>Train #{params.trainId} • {date}</p>
            </header>

            <motion.div
                className={styles.form}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Passenger Details</h2>
                    <div className={styles.passengerList}>
                        {passengers.map((p, i) => (
                            <div key={i} className={styles.passengerCard}>
                                <div className={styles.row}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Name</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={p.name}
                                            onChange={(e) => updatePassenger(i, 'name', e.target.value)}
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className={styles.inputGroup} style={{ flex: '0 0 80px' }}>
                                        <label className={styles.label}>Age</label>
                                        <input
                                            type="number"
                                            className={styles.input}
                                            value={p.age}
                                            onChange={(e) => updatePassenger(i, 'age', e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup} style={{ flex: '0 0 120px' }}>
                                        <label className={styles.label}>Gender</label>
                                        <select
                                            className={styles.input}
                                            value={p.gender}
                                            onChange={(e) => updatePassenger(i, 'gender', e.target.value)}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.addBtn} onClick={addPassenger}>
                        + Add Passenger
                    </button>
                </div>

                <div className={styles.summary}>
                    <div className={styles.total}>
                        Total: ₹{passengers.length * 1200}
                    </div>
                    <button
                        className={styles.payBtn}
                        onClick={handleBooking}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Pay & Book'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
