'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Train, Calendar, BarChart2, FileText } from 'lucide-react';
import Autocomplete from '@/components/ui/Autocomplete';
import stationsData from '@/data/stations.json';
import styles from './Hero.module.css';

export default function Hero() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('book');

    // Booking State
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');

    // PNR State
    const [pnr, setPnr] = useState('');

    const handleSearch = () => {
        if (from && to && date) {
            router.push(`/search?from=${from}&to=${to}&date=${date}`);
        }
    };

    const handlePnrCheck = () => {
        if (pnr) {
            // Mock PNR check or redirect
            router.push(`/bookings?pnr=${pnr}`);
        }
    };

    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                <div className={styles.grid} />
            </div>

            <div className={styles.content}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    The Future of <br />
                    <span className="text-gradient">Rail Travel</span>
                </motion.h1>

                <motion.div
                    className={styles.widgetContainer}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'book' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('book')}
                        >
                            <Train size={18} /> Book Ticket
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'pnr' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('pnr')}
                        >
                            <FileText size={18} /> PNR Status
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'charts' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('charts')}
                        >
                            <BarChart2 size={18} /> Charts / Vacancy
                        </button>
                    </div>

                    <div className={styles.tabContent}>
                        <AnimatePresence mode="wait">
                            {activeTab === 'book' && (
                                <motion.div
                                    key="book"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={styles.formGrid}
                                >
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>From</label>
                                        <Autocomplete
                                            options={stationsData}
                                            value={from}
                                            onChange={setFrom}
                                            placeholder="Station Name / Code"
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>To</label>
                                        <Autocomplete
                                            options={stationsData}
                                            value={to}
                                            onChange={setTo}
                                            placeholder="Station Name / Code"
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Date</label>
                                        <div className={styles.dateWrapper}>
                                            <Calendar className={styles.icon} size={18} />
                                            <input
                                                type="date"
                                                className={styles.input}
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Class</label>
                                        <select className={styles.input}>
                                            <option>All Classes</option>
                                            <option>Sleeper (SL)</option>
                                            <option>AC 3 Tier (3A)</option>
                                            <option>AC 2 Tier (2A)</option>
                                            <option>AC 1 Tier (1A)</option>
                                        </select>
                                    </div>

                                    <button className={styles.searchBtn} onClick={handleSearch}>
                                        <Search size={20} style={{ marginRight: '8px' }} />
                                        Search Trains
                                    </button>
                                </motion.div>
                            )}

                            {activeTab === 'pnr' && (
                                <motion.div
                                    key="pnr"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={styles.singleForm}
                                >
                                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                                        <label className={styles.label}>PNR Number</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="Enter 10-digit PNR Number"
                                            value={pnr}
                                            onChange={(e) => setPnr(e.target.value)}
                                        />
                                    </div>
                                    <button className={styles.searchBtn} onClick={handlePnrCheck}>
                                        Check Status
                                    </button>
                                </motion.div>
                            )}

                            {activeTab === 'charts' && (
                                <motion.div
                                    key="charts"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={styles.singleForm}
                                >
                                    <div className={styles.inputGroup} style={{ flex: 1 }}>
                                        <label className={styles.label}>Train Name / Number</label>
                                        <input type="text" className={styles.input} placeholder="Enter Train Name or Number" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Date</label>
                                        <input type="date" className={styles.input} />
                                    </div>
                                    <button className={styles.searchBtn}>
                                        Get Charts
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
