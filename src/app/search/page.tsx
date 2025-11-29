'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';

interface Train {
    id: string;
    number: string;
    name: string;
    type: string;
    routes: any[];
    schedules: any[];
}

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const [trains, setTrains] = useState<Train[]>([]);
    const [loading, setLoading] = useState(true);

    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');

    useEffect(() => {
        if (from && to && date) {
            fetch(`/api/trains/search?from=${from}&to=${to}&date=${date}`)
                .then(res => res.json())
                .then(data => {
                    setTrains(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [from, to, date]);

    if (loading) {
        return <div className={styles.container}>Loading trains...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    <span className="text-gradient">{from}</span> to <span className="text-gradient">{to}</span>
                </h1>
                <p className={styles.subtitle}>{date ? new Date(date).toDateString() : 'Select Date'} • {trains.length} Trains Found</p>
            </header>

            <div className={styles.trainList}>
                {trains.map((train, index) => (
                    <motion.div
                        key={train.id}
                        className={styles.trainCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.trainInfo}>
                                <h3>{train.name} <span className={styles.trainNumber}>{train.number}</span></h3>
                                <span className={styles.trainType}>{train.type}</span>
                            </div>
                        </div>

                        <div className={styles.routeInfo}>
                            <div className={styles.station}>
                                <div className={styles.time}>06:00</div>
                                <div className={styles.stationCode}>{from}</div>
                            </div>
                            <div className={styles.duration}>
                                8h 30m
                            </div>
                            <div className={styles.station}>
                                <div className={styles.time}>14:30</div>
                                <div className={styles.stationCode}>{to}</div>
                            </div>
                        </div>

                        <div className={styles.availability}>
                            {['Sleeper', '3 AC', '2 AC', '1 AC'].map(cls => (
                                <div key={cls} className={styles.classCard}>
                                    <div className={styles.className}>{cls}</div>
                                    <div className={styles.seats}>AVL {Math.floor(Math.random() * 50) + 1}</div>
                                </div>
                            ))}
                        </div>

                        <button
                            className={styles.bookBtn}
                            onClick={() => window.location.href = `/book/${train.id}?date=${date}`}
                        >
                            Book Now
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default function SearchResults() {
    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchResultsContent />
        </Suspense>
    );
}
