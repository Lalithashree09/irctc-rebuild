'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Autocomplete.module.css';

interface Option {
    code: string;
    name: string;
    state?: string | null;
}

interface AutocompleteProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function Autocomplete({ options, value, onChange, placeholder }: AutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val); // Allow free text but usually we want selection

        if (val.length > 0) {
            const filtered = options.filter(opt =>
                opt.name.toLowerCase().includes(val.toLowerCase()) ||
                opt.code.toLowerCase().includes(val.toLowerCase())
            );
            setFilteredOptions(filtered);
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleSelect = (option: Option) => {
        setQuery(option.code); // Or `${option.name} (${option.code})`
        onChange(option.code);
        setIsOpen(false);
    };

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <input
                type="text"
                className={styles.input}
                value={query}
                onChange={handleInputChange}
                onFocus={() => query && setIsOpen(true)}
                placeholder={placeholder}
            />

            {isOpen && filteredOptions.length > 0 && (
                <div className={styles.suggestions}>
                    {filteredOptions.map((option) => (
                        <div
                            key={option.code}
                            className={styles.item}
                            onClick={() => handleSelect(option)}
                        >
                            <span className={styles.name}>{option.name}</span>
                            <span className={styles.code}>{option.code}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
