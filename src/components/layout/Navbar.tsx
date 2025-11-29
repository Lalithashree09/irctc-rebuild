'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'PNR Status', path: '/pnr' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">
                    <span className="text-gradient">IRCTC</span>
                    <span className={styles.subtitle}>NextGen</span>
                </Link>
            </div>

            <div className={styles.links}>
                {navItems.map((item) => (
                    <Link key={item.path} href={item.path} className={styles.link}>
                        <span className={pathname === item.path ? styles.active : ''}>
                            {item.name}
                        </span>
                        {pathname === item.path && (
                            <motion.div
                                layoutId="underline"
                                className={styles.underline}
                            />
                        )}
                    </Link>
                ))}
            </div>

            <div className={styles.actions}>
                <Link href="/login" className={styles.loginBtn}>
                    Login
                </Link>
            </div>
        </nav>
    );
}
